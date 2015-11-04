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

AuctionUpdateProcess.prototype.feedAuctions = function(){
    var self = this;
    auctionService.feedAuctions(function(){
        self.feedAuctions();
    });
};



AuctionUpdateProcess.prototype.start = function(){
    logger.info("Starting AuctionUpdateProcess");
    this.updateAuction();
    this.feedAuctions();
};

module.exports = AuctionUpdateProcess;