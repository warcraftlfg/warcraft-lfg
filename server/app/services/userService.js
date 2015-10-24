"use strict";

//Define dependencies
var UserModel = process.require("models/UserModel.js");
var GuildUpdateModel = process.require("models/GuildUpdateModel.js");
var async = require("async");
var bnetAPI = process.require("api/bnet.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");


module.exports.getGuilds = function(region,id,callback){
    UserModel.findById(id,function(error,user){
        bnetAPI.getUserCharacters(region,user.get("accessToken"),function(error,characters){
            if (error) {
                callback(error);
                return;
            }
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
    });
};

module.exports.importGuilds = function(id){
    var self=this;
    config.bnet_regions.forEach(function(region) {
        self.getGuilds(region,id,function(error,guilds) {
            if(error) {
                logger.error(message);
                return;
            }
            guilds.forEach(function (guild) {
                new GuildUpdateModel({region:region, realm:guild.realm, name:guild.name}).save(function(error,guildUpdate){
                    logger.info("Insert guild  to update "+ guildUpdate.get("name")+"-"+guildUpdate.get("realm")+"-"+guildUpdate.get("region"));
                });
            });
        });
    });
};