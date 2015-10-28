"use strict";
var wowprogressAPI = process.require('api/wowprogress.js');
var logger = process.require("api/logger.js").get("logger");
var async = require('async');
var characterModel = process.require("models/characterModel.js");
var characterUpdateModel = process.require("models/characterUpdateModel.js");

module.exports.parseWowProgress = function(){

    wowprogressAPI.getAds(function(error,wowProgressGuildAds,wowProgressCharacterAds){
        if (error){
            logger.error(error.message);
            return;
        }
        wowProgressCharacterAds.forEach(function(wowProgressCharacter){
            characterModel.get(wowProgressCharacter.region,wowProgressCharacter.realm,wowProgressCharacter.name,function(error,character){

                if (!character || !character.ad){
                    characterModel.insertOrUpdateAd(wowProgressCharacter.region,wowProgressCharacter.realm,wowProgressCharacter.name,0,wowProgressCharacter,function(error,result){
                        characterUpdateModel.insertOrUpdate({region:wowProgressCharacter.region,realm:wowProgressCharacter.realm,name:wowProgressCharacter.name},function(error){
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