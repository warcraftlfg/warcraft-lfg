"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildModel = process.require("models/guildModel.js");
var characterUpdateModel = process.require("models/characterUpdateModel.js");
var applicationStorage = process.require("api/applicationStorage.js");
var userService = process.require("services/userService.js");
var async = require("async");

module.exports.updateLastGuild = function(callback){
    var self=this;
    guildUpdateModel.getOldest(function(error,guildUpdate) {
        if (error) {
            callback(error);
            return;
        }
        if (guildUpdate) {
            self.updateGuild(guildUpdate, function (error,guild) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null,guild);
            });
        }
        else
            callback();

    });
};

module.exports.updateGuild = function(guildUpdate,callback){
    var self=this;
    guildUpdateModel.delete(guildUpdate,function (error) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getGuild(guildUpdate.region, guildUpdate.realm, guildUpdate.name, function (error,guild) {
            if (error) {
                callback();
                return;
            }

            guildModel.insertOrUpdateBnet(guildUpdate.region,guild.realm,guild.name,guild,function (error,result){
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update guild: ' + guildUpdate.region + "-" + guild.realm + "-" + guild.name);
                callback(null,guild);

                //Dispatch count to all users if new
                if(result.result.nModified==0)
                    self.emitCount();


                self.addCharacterUpdate(guildUpdate.region,guild.realm,guild.members);

            });
        });
    });
};

module.exports.getCount = function(callback){
    guildModel.getCount(function(error,count){
        callback(error,count);
    });
};

module.exports.addCharacterUpdate = function (region,realm,members){
    //Add character to update
    members.forEach(function (member){
        var character = member.character;
        characterUpdateModel.insertOrUpdate({region:region,realm:realm,name:character.name},function(error,characterUpdate){
            if (error) {
                logger.error(error.message);
                return;
            }
            logger.info("Insert character to update "+ characterUpdate.region +"-"+characterUpdate.realm+"-"+characterUpdate.name);
        });
    });
};

module.exports.emitCount = function(){
    this.getCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var socketIo = applicationStorage.getSocketIo();
        socketIo.emit('get:guildCount', count);
    });
};

module.exports.isMember = function (id,region,realm,name,callback){

    userService.getGuilds(region, id, function(error,guilds){
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


