"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var wowprogressAPI  = process.require("core/api/wowProgress.js");
var characterService = process.require("characters/characterService.js");
var guildService = process.require("guilds/guildService.js");

/**
 * WowProgressUpdateProcess constructor
 * @constructor
 */
function WowProgressUpdateProcess(){
}

/**
 * Parse wowProgress
 */
WowProgressUpdateProcess.prototype.parseWowProgress = function() {
    var logger = applicationStorage.logger;
    var self = this;
    async.waterfall([
        function(callback){
            wowprogressAPI.getAds(function(error,wowProgressGuildAds,wowProgressCharacterAds) {
                callback(error,wowProgressGuildAds,wowProgressCharacterAds);
            });
        },
        function(wowProgressGuildAds, wowProgressCharacterAds, callback){
            async.parallel([
                function(callback) {
                    async.eachSeries(wowProgressGuildAds, function (wowProgressGuildAd, callback) {
                        guildService.insertWoWProgressGuildAd(wowProgressGuildAd,function(error){
                            callback(error);
                        });
                    }, function (error) {
                        if(error)
                            logger.error(error.message);
                        callback();
                    });
                },
                function(callback){
                    async.eachSeries(wowProgressCharacterAds,function(wowProgressCharacterAd,callback){
                        characterService.insertWoWProgressCharacterAd(wowProgressCharacterAd,function(error){
                            callback(error);
                        });
                    },function(error){
                        if(error)
                            logger.error(error.message);
                        callback();
                    });
                }
            ],function(){
                callback();
            });
        }
    ],function(error){
        if(error)
            logger.error(error.message);
        setTimeout(function() {
            self.parseWowProgress();
        }, 60000);
    });
};

/**
 * Start WowProgressUpdateProcess
 * @param callback
 */
WowProgressUpdateProcess.prototype.start = function(callback){
    applicationStorage.logger.info("Starting WowProgressUpdateProcess");
    this.parseWowProgress();
    callback();


};

module.exports = WowProgressUpdateProcess;