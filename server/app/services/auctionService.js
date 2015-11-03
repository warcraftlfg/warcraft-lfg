"use strict";
var logger = process.require("api/logger.js").get("logger");
var bnetAPI = process.require("api/bnet.js");
var async = require("async");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildService = process.require("services/guildService.js");
var auctionUpdateModel = process.require("models/auctionUpdateModel.js")
var auctionRealmUpdateModel = process.require("models/auctionRealmUpdateModel.js")

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');


module.exports.updateNext = function(callback){
    var self=this;
    auctionUpdateModel.getNextToUpdate(function(error,auctionUpdate) {
        if (error) {
            logger.error(error.message);
            callback(false);
            return;
        }
        if (auctionUpdate) {
            self.update(auctionUpdate.region,auctionUpdate.realm,auctionUpdate.name, function (error) {
                if (error) {
                    logger.error(error.message);
                }

                callback(false);
            });
        }
        else{
            setTimeout(function() {
                logger.info("No AuctionUpdate ... waiting 3 sec");
                callback(true);
            }, 3000);
        }
    });
};

module.exports.update = function(region,realm,name,callback){
    bnetAPI.getCharacter(region, realm, name, function (error, character) {
        if (error || !character.guild) {
            callback();
            return;
        }
        guildService.get(region, character.realm, character.guild.name,function(error,guild) {
            var timestampWeekAgo = new Date().getTime() - (7 * 24 * 3600 * 1000);
            if (guild == null || guild.bnet == null ||guild.bnet.updated < timestampWeekAgo) {
                guildUpdateModel.insertOrUpdate(region, character.realm, character.guild.name, 0, function (error) {
                    logger.info("Insert guild  to update " + region + "-" + character.realm + "-" + character.guild.name);
                    callback();
                });
            }
            else {
                callback();
            }
        });
    });
};

module.exports.importAuctionRealms = function(){

    async.eachSeries(config.bnet_regions,function(region,callback) {
        //Get Realms
        bnetAPI.getRealms(region, function (error, realms) {
            if (error) {
                return;
            }
            async.eachSeries(realms.realms,function(realm,callback){
                auctionRealmUpdateModel.insertOrUpdate(region,realm.connected_realms[0],0,function(){
                    logger.info("Insert Auction Realm to update " + region + "-" + realm.connected_realms[0]);
                    callback();
                });
            },function(){
                callback();
            });
        });
    });
};

module.exports.importAuctionOwners = function() {
    auctionRealmUpdateModel.getNextToUpdate(function (error, auctionRealmUpdate) {
        if (error) {
            logger.error(error.message);
            callback();
            return;
        }
        if (auctionRealmUpdate) {

            bnetAPI.getAuctions(auctionRealmUpdate.region, auctionRealmUpdate.realm, function (error, auctions) {
                if (error) {
                    return;
                }
                async.eachSeries(auctions.auctions, function (auction, callback) {
                    auctionUpdateModel.insertOrUpdate(auctionRealmUpdate.region, auction.ownerRealm, auction.owner, 0, function () {
                        logger.info("Insert Auction  to update " + auctionRealmUpdate.region + "-" + auction.ownerRealm + "-" + auction.owner);
                        callback();
                    });

                });
            });
        }
    });
};

