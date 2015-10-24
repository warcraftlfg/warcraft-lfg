"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var GuildUpdateModel = process.require("models/GuildUpdateModel.js");
var GuildModel = process.require("models/GuildModel.js");
var CharacterUpdateModel = process.require("models/CharacterUpdateModel.js");

module.exports.updateLastGuild = function(callback){
    var self=this;
    GuildUpdateModel.getOlder(function(error,guildUpdate) {
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
    var region = guildUpdate.get("region");
    var realm = guildUpdate.get("realm");
    var name = guildUpdate.get("name");
    guildUpdate.delete(function (error) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getGuild(region, realm, name, function (error,guild) {
            if (error) {
                callback();
                return;
            }
            guild.region = region;
            new GuildModel(guild).save(function (error,guild){
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update guild: ' + guild.get("region") + "-" + guild.get("realm") + "-" + guild.get("name"));
                callback(null,guild);

                //Add character to update
                guild.get("members").forEach(function (member){
                    var character = member.character;
                    new CharacterUpdateModel({region:region,realm:realm,name:character.name}).save(function(error,characterUpdate){
                        if (error) {
                            logger.error(error.message);
                            return;
                        }
                        logger.info("Insert character to update "+ characterUpdate.get("region") +"-"+characterUpdate.get("realm")+"-"+characterUpdate.get("name"));

                    });
                });

            });
        });
    });
};



