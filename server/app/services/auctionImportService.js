"use strict";
var logger = process.require("api/logger.js").get("logger");
var bnetAPI = process.require("api/bnet.js");
var async = require("async");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildService = process.require("services/guildService.js");
var auctionUpdateModel = process.require("models/auctionUpdateModel.js")

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');


module.exports.updateNext = function(callback){
    var self=this;
    auctionUpdateModel.getNextToUpdate(function(error,auctionUpdate) {
        if (error) {
            logger.error(error.message);
            callback();
            return;
        }
        if (auctionUpdate) {
            self.update(auctionUpdate.region,auctionUpdate.realm,auctionUpdate.name, function (error) {
                if (error) {
                    logger.error(error.message);
                }

                callback();
            });
        }
        else{
            callback();
        }
    });
};

module.exports.update = function(region,realm,name,callback){
    auctionUpdateModel.delete(region,realm,name,function (error) {
        if (error) {
            callback();
            return;
        }
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
    });
};

module.exports.importAuctions = function(){

    async.eachSeries(config.bnet_regions,function(region,callback) {
        //Get Realms
        bnetAPI.getRealms(region, function (error, realms) {
            if (error) {
                return;
            }
            async.eachSeries(realms.realms,function(realm,callback){
                bnetAPI.getAuctions(region, realm.name, function (error, auctions) {
                    if (error) {
                        return;
                    }
                    async.eachSeries(auctions.auctions, function (auction, callback) {
                        auctionUpdateModel.insertOrUpdate(region,auction.ownerRealm,auction.owner,0,function(){
                            logger.info("Insert Auction  to update " + region + "-" + auction.ownerRealm + "-" + auction.owner);
                            callback();
                        });

                    },function(){
                        callback();
                    });
                });
            },function(){
                callback();
            });
        });
    });


};