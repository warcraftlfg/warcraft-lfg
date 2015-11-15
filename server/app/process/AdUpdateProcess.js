"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var characterService = process.require("services/characterService.js");
var guildService = process.require("services/guildService.js");

function AdUpdateProcess(){
}



AdUpdateProcess.prototype.setAdsToUpdate = function() {
    characterService.setAdsToUpdate(function(){});
    guildService.setAdsToUpdate(function(){});
};


AdUpdateProcess.prototype.start = function(){
    logger.info("Starting CharacterUpdateProcess");
    //Start Cron every day at 4am
    var self=this;
    new cronJob('0 0 4 * * *',
        function() {
            self.setAdsToUpdate();
        },
        null,
        true
    );
    self.setAdsToUpdate();

};

module.exports = AdUpdateProcess;
