"use strict";
var wowprogressAPI = process.require('api/wowprogress.js');
var logger = process.require("api/logger.js").get("logger");
var async = require('async');
var characterModel = process.require("models/characterModel.js");
var guildModel = process.require("models/guildModel.js");
var characterUpdateModel = process.require("models/characterUpdateModel.js");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var characterService = process.require("services/characterService.js");
var guildService = process.require("services/guildService.js");

module.exports.parseWowProgress = function(){

    wowprogressAPI.getAds(function(error,wowProgressGuildAds,wowProgressCharacterAds){
        if (error){
            logger.error(error.message);
            return;
        }
        wowProgressGuildAds.forEach(function(wowProgressGuild){
            guildService.get(wowProgressGuild.region,wowProgressGuild.realm,wowProgressGuild.name,function(error,guild){
                if (error) {
                    logger.error(error.message);
                    return;
                }
                if (!guild || !guild.ad){
                    guildService.insertOrUpdateAd(wowProgressGuild.region,wowProgressGuild.realm,wowProgressGuild.name,0,wowProgressGuild,function(error){
                        if (error) {
                            logger.error(error.message);
                            return;
                        }
                        guildUpdateModel.insertOrUpdate(wowProgressGuild.region,wowProgressGuild.realm,wowProgressGuild.name,10,function(error){
                            if (error) {
                                logger.error(error.message);
                                return;
                            }
                            logger.info("Insert guild to update "+ wowProgressGuild.region +"-"+wowProgressGuild.realm+"-"+wowProgressGuild.name);
                        });
                    });
                }
            });
        });
        wowProgressCharacterAds.forEach(function(wowProgressCharacter){
            characterService.get(wowProgressCharacter.region,wowProgressCharacter.realm,wowProgressCharacter.name,function(error,character){
                if (error) {
                    logger.error(error.message);
                    return;
                }
                if (!character || !character.ad){
                    characterService.insertOrUpdateAd(wowProgressCharacter.region,wowProgressCharacter.realm,wowProgressCharacter.name,0,wowProgressCharacter,function(error){
                        if (error) {
                            logger.error(error.message);
                            return;
                        }
                        characterUpdateModel.insertOrUpdate(wowProgressCharacter.region,wowProgressCharacter.realm,wowProgressCharacter.name,10,function(error){
                            if (error) {
                                logger.error(error.message);
                                return;
                            }
                            logger.info("Insert character to update "+ wowProgressCharacter.region +"-"+wowProgressCharacter.realm+"-"+wowProgressCharacter.name);
                        });
                    });
                }
            });

        });
    });
};