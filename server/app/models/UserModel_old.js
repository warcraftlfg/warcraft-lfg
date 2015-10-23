"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("api/applicationStorage");
var bnetAPI  = require("../api/bnet.js");
//var bnetAPI = process.require("api/bnet.js");
var GuildUpdateModel = process.require("models/GuildUpdateModel.js");
var logger = process.require("api/logger.js").get("logger");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var guildUpdateModel = new GuildUpdateModel();

/**
 * Defines a model class to manipulate users
 * @constructor
 */
function UserModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = UserModel;

UserModel.prototype.findOrCreateOauthUser = function (user,callback){
    var self = this;

    this.findById(user.id,function(error,result){
        //Import Guild on first connect
        if(result==null)
            self.importGuilds(user.accessToken);

        //Create or Update  User
        self.insertOrUpdate(user,function(error,result){
            delete user.accessToken;
            callback(user);
        });

    });

};

UserModel.prototype.findById = function (id,callback){
    this.database.get("users",{id: id},{_id: 0, accessToken: 0},1,function(error,user){
        callback(error, user && user[0]);
    });
};


UserModel.prototype.insertOrUpdate = function (user,callback){
    this.database.insertOrUpdate("users",{id:user.id},user, function(error,result){
        callback(error, result);
    });
};


UserModel.prototype.getAccessToken = function(id,callback){
    this.database.get("users",{id: id},{},1,function(error,user){
        callback(error, user && user[0].accessToken);
    });
};


UserModel.prototype.getGuilds = function(region,id,callback){
    this.getAccessToken(id,function(error,accessToken) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getUserCharacters(region,accessToken,function(error,characters){
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


UserModel.prototype.getCharacters = function(region,id,callback){

    this.getAccessToken(id,function(error,accessToken) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getUserCharacters(region, accessToken, function (error, characters) {
            if (error) {
                callback(error);
                return;
            }

            var charactersFilter = {};
            //Fetch all characters
            async.forEach(characters, function (character, callback) {
                character.region = region;
                charactersFilter[character.name + character.realm] = character;
                callback();
            });
            //Remove Key
            var arr = Object.keys(charactersFilter).map(function (key) {
                return charactersFilter[key]
            });
            callback(null, arr);
        });
    });
};


UserModel.prototype.importGuilds = function(accessToken){
    var self=this;
    config.bnet_regions.forEach(function(region) {

        self.getGuilds(region,accessToken,function(error,guilds) {
            guilds.forEach(function (guild) {
                guildUpdateModel.add(region, guild.realm, guild.name,function (error,result){
                    logger.info("Insert guild  to update "+ guild.name+"-"+guild.realm+"-"+region)
                });
            });
        });
    });
};