"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var wowProgressService = process.require("services/wowProgressService.js");

function WowProgressUpdateProcess(){
    this.lock = false;
}

WowProgressUpdateProcess.prototype.parseWowProgress = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        logger.debug("Start parsing WowProgress");
        wowProgressService.parseWowProgress(function (error) {
            if (error)
                logger.error(error.message, error.stack);
            logger.debug("End parsing WowProgress");
            self.lock = false;
        });
    }
};

WowProgressUpdateProcess.prototype.start = function(){
    logger.info("Starting WowProgressUpdateProcess");

    //Start Cron every minute
    var self=this;
    new cronJob('0 * * * * *',
        function() {
            self.parseWowProgress();
        },
        null,
        true
    );
    self.parseWowProgress();

};

module.exports = WowProgressUpdateProcess;