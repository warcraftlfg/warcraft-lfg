"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var wowProgressService = process.require("services/wowProgressService.js");

function WowProgressUpdateProcess(){
}

WowProgressUpdateProcess.prototype.updateCharactersAd = function() {
    wowProgressService.parseWowProgress(function(error){
        if (error) {
            logger.error(error.message);
        }
    });
};

WowProgressUpdateProcess.prototype.start = function(){
    logger.info("Starting WowProgressUpdateProcess");

    //Start Cron every minute
    var self=this;
    new cronJob('0 * * * * *',
        function() {
            self.updateCharactersAd();
        },
        null,
        true
    );
    self.updateCharactersAd();
};

module.exports = WowProgressUpdateProcess;