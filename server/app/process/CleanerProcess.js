"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");

function CleanerProcess(){
}

CleanerProcess.prototype.cleanAds = function() {
    var logger = applicationStorage.logger;
    async.parallel([
        function(callback){
            //Disable lfg for old character ads
            logger.info("Set LFG to false for old character ads");
            characterModel.disableLfgForOldAds(function(error){
                if(error)
                    logger.error(error.message);
                callback();
            })
        },
        function(callback){
            //Disable lfg for old guild ads
            logger.info("Set LFG to false for old guild ads");
            guildModel.disableLfgForOldAds(function(error){
                if(error)
                    logger.error(error.message);
                callback();
            })
        },
        function(callback){
            //Refresh all wowprogress ads
            //TODO refresh all wowprogress ads
            callback();
        }
    ],function(){
        process.exit();
    });

};


CleanerProcess.prototype.start = function(){
    applicationStorage.logger.info("Starting CleanerProcess");
    this.cleanAds();

};

module.exports = CleanerProcess;