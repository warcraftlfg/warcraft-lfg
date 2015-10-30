"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var wowProgressService = process.require("services/WowProgressService.js");

function WowProgressUpdateProcess(){
    this.lock = false;
}

WowProgressUpdateProcess.prototype.updateCharactersAd = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        wowProgressService.parseWowProgress(function(error){
            if (error){
                logger.error(error.message);
            }
            self.lock = false;
        });
        self.lock = false;
    }
};

WowProgressUpdateProcess.prototype.start = function(){
    logger.info("Starting WowProgressUpdateProcess");

    //Start Cron every sec
    var self=this;
    new cronJob('0 * * * * *',
        function() {
            self.updateCharactersAd();
        },
        null,
        true
    );
};

module.exports = WowProgressUpdateProcess;