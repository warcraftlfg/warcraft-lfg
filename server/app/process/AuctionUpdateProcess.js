"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var auctionService = process.require("services/auctionService.js");

function AuctionUpdateProcess(){
}

AuctionUpdateProcess.prototype.updateAuction = function() {
    var self = this;

    auctionService.updateNext(function(empty){
        console.log(empty);
        if(empty)
            auctionService.importAuctionOwners();
        else
            self.updateAuction();
    });
};

AuctionUpdateProcess.prototype.importAuctionRealms = function(){
    auctionService.importAuctionRealms();
};

AuctionUpdateProcess.prototype.start = function(){
    logger.info("Starting AuctionUpdateProcess");
    var self = this;
    self.updateAuction();
    self.importAuctionRealms();
    var self=this;
    new cronJob('0 0 3 * * 1',
        function() {
            self.importAuctionRealms();
        },
        null,
        true
    );
};

module.exports = AuctionUpdateProcess;