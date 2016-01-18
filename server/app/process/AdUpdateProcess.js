"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");

function AdUpdateProcess(autoStop){
    this.autoStop = autoStop;
}

AdUpdateProcess.prototype.setAdsToUpdate = function() {
    var logger = applicationStorage.logger;
    var self = this;
    async.parallel([
        function(callback){
            //Set to Update Character Ads
            async.waterfall([
                function (callback) {
                    characterModel.find({"ad.lfg": true},{region:1,realm:1,name:1},function (error, characters) {
                        callback(error, characters);
                    });
                },
                function (characters, callback) {
                    async.each(characters,function(character,callback) {
                        updateModel.insert('cu',character.region, character.realm, character.name, 3, function (error) {
                            logger.verbose("Insert character to update %s-%s-%s to update with priority 3",character.region, character.realm, character.name);
                            callback(error);
                        });
                    },function(error){
                        callback(error,characters.length);
                    });
                }
            ],function(error,length){
                if (error && error !==true)
                    logger.error(error.message);
                else
                    logger.info("Added %s characters to update",length)
                callback();
            });
        },
        function(callback){
            //Set to Update Guild Ads
            async.waterfall([
                function (callback) {
                    guildModel.find({"ad.lfg": true},{region:1,realm:1,name:1},function (error, guilds) {
                        callback(error, guilds);
                    });
                },
                function (guilds, callback) {
                    async.each(guilds,function(guild,callback) {
                        updateModel.insert('gu',guild.region, guild.realm, guild.name, 3, function (error) {
                            logger.verbose("Insert guild %s-%s-%s to update with priority 3",guild.region, guild.realm, guild.name);
                            callback(error);
                        });
                    },function(error){
                        callback(error,guilds.length);
                    });
                }
            ],function(error,length){
                if (error && error !==true)
                    logger.error(error.message);
                else
                    logger.info("Added %s guilds to update",length)
                callback();
            });
        }
    ],function(){
        if(self.autoStop) {
            process.exit();
        }

    })

};


AdUpdateProcess.prototype.start = function(callback){
    applicationStorage.logger.info("Starting AdUpdateProcess");
    this.setAdsToUpdate();
    callback();
};

module.exports = AdUpdateProcess;
