"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var realmService = process.require("services/realmService.js");

function RealmUpdateProcess(){
    this.lock = false;
}

RealmUpdateProcess.prototype.cleanAds = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        realmService.importRealms(function(){
            self.lock = false;
        });
    }
};

RealmUpdateProcess.prototype.start = function(){
    logger.info("Starting RealmUpdateProcess");

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

module.exports = RealmUpdateProcess;