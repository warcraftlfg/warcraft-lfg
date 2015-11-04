"use strict";

//Module dependencies
var logger = process.require("api/logger.js").get("logger");
var auctionService = process.require("services/auctionService.js");

function AuctionUpdateProcess(){
}

AuctionUpdateProcess.prototype.updateAuction = function() {
    var self = this;

    auctionService.updateNext(function(){
        self.updateAuction();
    });
};



AuctionUpdateProcess.prototype.start = function(){
    logger.info("Starting AuctionUpdateProcess");
    var self = this;
    self.updateAuction();
};

module.exports = AuctionUpdateProcess;