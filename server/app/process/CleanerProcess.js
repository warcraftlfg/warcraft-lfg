"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var characterService = process.require("services/characterService.js");
var guildService = process.require("services/guildService.js");
var wowProgressService = process.require("services/wowProgressService.js");

function CleanerProcess(){
    this.lockCleaner = false;
    this.lockRefreshWowProgress = false;
}

CleanerProcess.prototype.cleanAds = function() {
    var self = this;
    if (self.lockCleaner == false) {
        self.lockCleaner = true;
        characterService.deleteOldAds(function(){
            guildService.deleteOldAds(function(){
                self.lockCleaner = false;
            });
        });
    }
};

CleanerProcess.prototype.refreshWowProgress = function(){
    var self = this;
    if (self.lockRefreshWowProgress == false) {
        self.lockRefreshWowProgress = true;
        wowProgressService.refreshAll(function(){
           self.lockRefreshWowProgress = false;
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
    self.refreshWowProgress();
};

module.exports = CleanerProcess;