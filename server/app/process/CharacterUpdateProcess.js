"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var characterModel = process.require("characters/characterModel.js");
var characterService = process.require("characters/characterService.js");
var guildKillService = process.require("guildKills/guildKillService.js");

function CharacterUpdateProcess(){
}

CharacterUpdateProcess.prototype.updateCharacter = function(){

    var logger = applicationStorage.logger;
    var self = this;
    async.waterfall([
        function(callback){
            //Get next guild to update
            updateService.getNextUpdate('cu',function(error,characterUpdate){
                if(characterUpdate == null){
                    //Guild update is empty
                    logger.info("No character to update ... waiting 3 sec");
                    setTimeout(function() {
                        callback(true);
                    }, 3000);
                } else {
                    logger.info("Update character %s-%s-%s",characterUpdate.region,characterUpdate.realm,characterUpdate.name);
                    callback(error,characterUpdate);
                }
            });
        },
        function(characterUpdate,callback){
            //Sanitize name
            bnetAPI.getCharacter(characterUpdate.region,characterUpdate.realm,characterUpdate.name,["guild","items","progression","talents","achievements","statistics","challenge","pvp","reputation","stats"],function(error,character){
                if(error){
                    if(error.statusCode == 403){
                        logger.info("Bnet Api Deny ... waiting 1 min");
                        updateModel.insert("cu",characterUpdate.region,characterUpdate.realm,characterUpdate.name,characterUpdate.priority,function(error){
                            setTimeout(function() {
                                callback(true);
                            }, 60000);
                        });
                    } else {
                        callback(error);
                    }
                } else {
                    callback(null,characterUpdate.region,character);
                }
            })
        },
        function(region,character,callback) {
            async.parallel([
                function(callback) {
                    //Insert BNET
                    characterModel.upsertBnet(region,character.realm,character.name,character,function(error){
                        if(error){
                            logger.error(error.message);
                        }
                        callback();
                    });
                },
                function(callback){
                    //Insert WarcraftLogs
                    characterService.updateWarcraftLogs(region,character.realm,character.name,function(error){
                        if(error){
                            logger.error(error.message);
                        }
                        callback();
                    })
                },
                function(callback){
                    //Insert Progress
                    guildKillService.updateProgress(region,character,function(error){
                        if(error){
                            logger.error(error.message);
                        }
                        callback();
                    });
                }
            ],function(){
                callback();
            });
        }
    ],function(error){
        if (error && error !==true)
            logger.error(error.message);
        self.updateCharacter();
    });
};


CharacterUpdateProcess.prototype.start = function(callback){
    applicationStorage.logger.info("Starting CharacterUpdateProcess");
    this.updateCharacter();
    callback();
};

module.exports = CharacterUpdateProcess;
