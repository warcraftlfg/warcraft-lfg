"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildModel = process.require("models/guildModel.js");
var applicationStorage = process.require("api/applicationStorage.js");
var characterUpdateModel =  process.require("models/characterUpdateModel.js");
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

                guild.members.forEach(function (member){
                    characterUpdateModel.insertOrUpdate({region:guildUpdate.region,realm:member.character.realm,name:member.character.name},function(error){
                        if (error) {
                            logger.error(error.message);
                            return;
                        }
                        logger.info("Insert character to update "+ guildUpdate.region +"-"+member.realm+"-"+member.name);
                    });
                });

            });
        });
    });
};

module.exports.getCount = function(callback){
    guildModel.getCount(function(error,count){
        callback(error,count);
    });
};




module.exports.emitCount = function(){
    this.getCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var socketIo = applicationStorage.getSocketIo();
        //If socketIo undefined try io-emitter (for cron)
        if(!socketIo)
            var io = require('socket.io-emitter')();
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


