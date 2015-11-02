"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var auctionImportService = process.require("services/auctionImportService.js");

function AuctionUpdateProcess(){
    this.lock = false;
}

AuctionUpdateProcess.prototype.updateAuction = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        auctionImportService.updateNext(function(){
            self.lock = false;
        });
    }
};

AuctionUpdateProcess.prototype.start = function(){
    logger.info("Starting AuctionUpdateProcess");

    //Start Cron every day at 4am
    var self=this;
    new cronJob('* * *  * * *',
        function() {
            self.updateAuction();
        },
        null,
        true
    );
    self.updateAuction();
};

module.exports = AuctionUpdateProcess;