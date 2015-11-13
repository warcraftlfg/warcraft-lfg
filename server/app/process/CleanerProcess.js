"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var characterService = process.require("services/characterService.js");
var guildService = process.require("services/guildService.js");

function CleanerProcess(){
    this.lock = false;
}

CleanerProcess.prototype.cleanAds = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        characterService.deleteOldAds(function(){
            guildService.deleteOldAds(function(){
                self.lock = false;
            });
        });
    }
};

CleanerProcess.prototype.start = function(){
    logger.info("Starting CleanerProcess");

    //Start Cron every day at 4am
    var self=this;
    new cronJob('0 0 4 * * *',
        function() {
            self.cleanAds();
        },
        null,
        true
    );
    self.cleanAds();
};

module.exports = CleanerProcess;