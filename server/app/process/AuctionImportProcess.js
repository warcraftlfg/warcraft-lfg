"use strict";
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var auctionImportService = process.require("services/auctionImportService.js");

function AuctionImportProcess(){
}

AuctionImportProcess.prototype.importAuctions = function(){
    auctionImportService.importAuctions();
};

AuctionImportProcess.prototype.start = function(){
    logger.info("Starting AuctionImportProcess");
    //Start Cron every sec
    var self=this;
    new cronJob('0 0 3 * * 1',
        function() {
            self.importAuctions();
        },
        null,
        true
    );
};

module.exports = AuctionImportProcess;