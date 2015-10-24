"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var guildUpdateModel = process.require("models/GuildUpdateModel.js");
var guildModel = process.require("models/GuildModel.js");
var characterUpdateModel = process.require("models/CharacterUpdateModel.js");

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
            guild.region = guildUpdate.region;
            guildModel.insertOrUpdate(guild,function (error,guild){
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update guild: ' + guild.region + "-" + guild.realm + "-" + guild.name);
                callback(null,guild);

                //Add character to update
                guild.members.forEach(function (member){
                    var character = member.character;
                    characterUpdateModel.insertOrUpdate({region:guild.region,realm:guild.realm,name:character.name},function(error,characterUpdate){
                        if (error) {
                            logger.error(error.message);
                            return;
                        }
                        logger.info("Insert character to update "+ characterUpdate.region +"-"+characterUpdate.realm+"-"+characterUpdate.name);
                    });
                });

            });
        });
    });
};



