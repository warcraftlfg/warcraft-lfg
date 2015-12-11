"use strict";
var logger = process.require("api/logger.js").get("logger");
var bnetAPI = process.require("api/bnet.js");
var async = require("async");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildService = process.require("services/guildService.js");
var auctionUpdateModel = process.require("models/auctionUpdateModel.js")
var auctionRealmUpdateModel = process.require("models/auctionRealmUpdateModel.js")
var characterUpdateModel = process.require("models/characterUpdateModel.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');


module.exports.updateNext = function(callback){
    var self=this;
    auctionUpdateModel.getNextToUpdate(function(error,auctionUpdate) {
        if (error) {
            logger.error(error.message);
            return callback();
        }

        if (auctionUpdate) {
            //Get Auction Update Result (json or key)
            if(auctionUpdate.region && auctionUpdate.realm && auctionUpdate.name){
                //Auction Update is ready to parse
                logger.info("Update Auction "+auctionUpdate.region+"-"+auctionUpdate.realm+"-"+auctionUpdate.name);
                self.update(auctionUpdate.region,auctionUpdate.realm,auctionUpdate.name, function (error) {
                    if(error && error.message == "BNET_API_ERROR_DENY") {
                        //Reset the auctionUpdateModel
                        auctionUpdateModel.insertOrUpdate(auctionUpdate.region,auctionUpdate.realm,auctionUpdate.name,auctionUpdate.priority,function(error){
                            if(error) {
                                logger.error(error.message);
                                return callback();
                            }
                            logger.warn("Bnet Api Deny ... waiting 1 min");
                            return setTimeout(function () {
                                callback();
                            }, 60000);
                        });
                    }
                    else
                        callback();
                });
            }
            else{
                //Auction Update is already parse before
                callback();
            }
        }
        else{
            //Auction Update is empty
            logger.info("No AuctionUpdate ... waiting 3 sec");
            setTimeout(function() {
                callback();
            }, 3000);
        }
    });
};

module.exports.update = function(region,realm,name,callback){
    bnetAPI.getCharacterWithParams(region, realm, name, [],function (error, character) {
        if (error)
            return callback(error);

        // Check if user have a guild
        if (!character.guild)
            return callback();

        guildService.get(region, character.realm, character.guild.name,function(error,guild) {
            if (error)
                return callback(error);

            var timestampWeekAgo = new Date().getTime() - (7 * 24 * 3600 * 1000);
            if (guild == null || guild.bnet == null ||guild.bnet.updated < timestampWeekAgo) {
                guildUpdateModel.insertOrUpdate(region, character.realm, character.guild.name, 0, function (error) {
                    if (error)
                        return callback(error);
                    logger.info("Insert guild to update " + region + "-" + character.guild.realm + "-" + character.guild.name);
                    callback();
                });
            }
            else {
                callback();
            }
        });
    });
};

module.exports.feedAuctions = function(callback){
    var self = this;
    characterUpdateModel.getPosition(0,function(error,characterUpdatecount){
        if(error)
            return callback(error);
        auctionUpdateModel.getPosition(0,function(error,auctionUpdatecount) {
            if (error)
                return callback(error);
            if (characterUpdatecount == 0 && auctionUpdatecount == 0)
                self.importAuctionOwners(function (error) {
                    if(error && error.message == "BNET_API_ERROR_DENY") {
                        //Reset the auctionUpdateModel
                        auctionUpdateModel.insertOrUpdate(auctionUpdate.region,auctionUpdate.realm,auctionUpdate.name,auctionUpdate.priority,function(error){
                            if(error) {
                                logger.error(error.message);
                                return callback();
                            }
                            logger.warn("Feeds Auction Bnet Api Deny ... waiting 1 min");
                            return setTimeout(function () {
                                callback();
                            }, 60000);
                        });
                    }else {
                        return callback(error);
                    }
                });
            else {
                logger.info("Cannot Feed Auctions CharacterUpdate et auctionUpdate is not empty waiting 3 sec");
                setTimeout(function () {
                    callback();
                }, 3000);
            }
        });
    });
};
module.exports.importAuctionRealms = function(callback){

    async.eachSeries(config.bnet_regions,function(region,callback) {
        //Get Realms
        bnetAPI.getRealms(region, function (error, realms) {
            if (error) {
                return callback(error);
            }
            async.eachSeries(realms.realms,function(realm,callback){
                auctionRealmUpdateModel.insertOrUpdate(region,realm.connected_realms[0],0,function(error){
                    if(error)
                        return callback(error);
                    logger.info("Insert Auction Realm to update " + region + "-" + realm.connected_realms[0]);
                    callback();
                });
            },function(error){
                callback(error);
            });
        });
    },function(error){
        callback(error);
    });
};


module.exports.importAuctionOwners = function(callback) {
    var self=this;

    auctionRealmUpdateModel.getNextToUpdate(function (error, auctionRealmUpdate) {
        if (error) {
            logger.error(error.message);
            return callback(error);
        }
        if (auctionRealmUpdate) {
            if(auctionRealmUpdate.region && auctionRealmUpdate.realm) {
                bnetAPI.getAuctions(auctionRealmUpdate.region, auctionRealmUpdate.realm, function (error, auctions) {
                    if (error)
                        return callback(error);

                    async.eachSeries(auctions.auctions, function (auction, callback) {
                        auctionUpdateModel.insertOrUpdate(auctionRealmUpdate.region, auction.ownerRealm, auction.owner, 0, function () {
                            logger.info("Insert Auction  to update " + auctionRealmUpdate.region + "-" + auction.ownerRealm + "-" + auction.owner);
                            callback();
                        });

                    }, function () {
                        callback();
                    });
                });
            }
            else {
                callback();
            }
        }
        else {
            logger.info("No AuctionRealmUpdate found ... import them ");
            self.importAuctionRealms(function(){
                callback();
            });
        }
    });
};

