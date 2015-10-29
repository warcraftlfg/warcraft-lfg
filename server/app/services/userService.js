"use strict";

//Define dependencies
var userModel = process.require("models/userModel.js");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var async = require("async");
var bnetAPI = process.require("api/bnet.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");


module.exports.getGuilds = function(region,id,callback){
    this.getCharacters(region,id,function(error,characters){
        var guilds = {};
        //Fetch all characters and keep guild
        async.forEach(characters,function(character,callback){
            if(character.guild)
                guilds[character.guild+character.guildRealm] = {name: character.guild, realm: character.guildRealm, region: region}
            callback();
        });
        //Remove Key
        var arr = Object.keys(guilds).map(function (key) {return guilds[key]});
        callback(null,arr);
    });

};

module.exports.getCharacters = function(region,id,callback){
    userModel.findById(id,function(error,user){
        if (error) {
            callback(error);
        }
        bnetAPI.getUserCharacters(region,user.accessToken,function(error,characters){
            if (error) {
                callback(error);
                return;
            }
            callback(null,characters);
        });
    });
};

module.exports.importGuilds = function(id){
    var self=this;
    config.bnet_regions.forEach(function(region) {
        self.getGuilds(region,id,function(error,guilds) {
            if(error) {
                logger.error(error.message);
                return;
            }
            guilds.forEach(function (guild) {
                guildUpdateModel.insertOrUpdate(region, guild.realm, guild.name,0,function(error){
                    logger.info("Insert guild  to update "+ region+"-"+guild.realm+"-"+guild.name);
                });
            });

        });
    });
};

module.exports.isOwner = function (id,region,realm,name,callback){
    //Do not check if owner when id = 0
    if(id==0){
        callback(null,true);
        return;
    }
    this.getCharacters(region,id,function (error,characters) {
        if (error) {
            callback(error);
            return;
        }
        var isMyCharacter = false;
        async.forEach(characters, function (character, callback) {
            if (character.name == name && character.realm == realm)
                isMyCharacter = true;
            callback();
        });
        callback(error,isMyCharacter);
    });
};

module.exports.isMember = function (id,region,realm,name,callback){
    //Do not check if owner when id = 0
    if(id==0){
        callback(null,true);
        return;
    }
    this.getGuilds(region, id, function(error,guilds){
        if (error){
            callback(error);
            return;
        }
        var isMyCharacter = false;
        async.forEach(guilds, function (guild, callback) {
            if (guild.name == name && guild.realm == realm)
                isMyCharacter = true;
            callback();
        });
        callback(error,isMyCharacter);
    });
};
