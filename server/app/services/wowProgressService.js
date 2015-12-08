"use strict";
var wowprogressAPI = process.require('api/wowProgress.js');
var logger = process.require("api/logger.js").get("logger");
var async = require('async');
var characterUpdateModel = process.require("models/characterUpdateModel.js");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var characterService = process.require("services/characterService.js");
var guildService = process.require("services/guildService.js");
var bnetAPI = process.require("api/bnet.js");

module.exports.parseWowProgress = function(callback){
    var self = this;
    async.waterfall([
        function(callback){
            wowprogressAPI.getAds(function(error,wowProgressGuildAds,wowProgressCharacterAds) {
                callback(error,wowProgressGuildAds,wowProgressCharacterAds);
            });
        },
        function(wowProgressGuildAds, wowProgressCharacterAds, callback){
            async.series([
                function(callback) {
                    async.eachSeries(wowProgressGuildAds, function (wowProgressGuildAd, callback) {
                        self.insertWoWProgressGuildAd(wowProgressGuildAd,function(error){
                            callback(error);
                        });
                    }, function (error) {
                        callback(error);
                    });
                },
                function(callback){
                    async.eachSeries(wowProgressCharacterAds,function(wowProgressCharacterAd,callback){
                        self.insertWoWProgressCharacterAd(wowProgressCharacterAd,function(error){
                            callback(error);
                        });
                    },function(error){
                        callback(error);
                    });
                }
            ],function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

module.exports.insertWoWProgressGuildAd = function(wowProgressGuildAd,callback){
    async.waterfall([
        function (callback) {
            bnetAPI.getGuild(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, function (error, guild) {
                callback(error, guild);
            });
        },
        function (guild, callback) {
            //Force name with bnet response (case or russian realm name)
            wowProgressGuildAd.realm = guild.realm;
            wowProgressGuildAd.name = guild.name;
            guildService.get(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, function (error, guild) {
                callback(error, guild);
            });
        },
        function (guild, callback) {
            if (!guild || (guild && !guild.ad) ||(guild && guild.ad && !guild.ad.updated))
                async.parallel([
                    function (callback) {
                        guildService.insertOrUpdateAd(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, 0, wowProgressGuildAd, function (error) {
                            callback(error);
                        });
                    },
                    function (callback) {
                        guildUpdateModel.insertOrUpdate(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, 10, function (error) {
                            if (!error)
                                logger.info("Insert guild to update " + wowProgressGuildAd.region + "-" + wowProgressGuildAd.realm + "-" + wowProgressGuildAd.name + " priority 10");
                            callback(error);
                        });
                    }
                ], function (error) {
                    callback(error)
                });
            else{
                logger.debug("Guild is already in datase " + wowProgressGuildAd.region + "-" + wowProgressGuildAd.realm + "-" + wowProgressGuildAd.name);
                callback();
            }
        }
    ], function (error) {
        callback(error);
    });
};

module.exports.insertWoWProgressCharacterAd = function(wowProgressCharacterAd,callback){
    async.waterfall([
        function(callback) {
            bnetAPI.getCharacter(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, function (error, character) {
                callback(error,character);
            });
        },
        function(character,callback) {
            //Force name with bnet response (case or russian realm name)
            wowProgressCharacterAd.realm = character.realm;
            wowProgressCharacterAd.name = character.name;
            characterService.get(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, function (error, character) {
                callback(error,character);
            });
        },
        function(character,callback) {
            if (!character || (character && !character.ad) || (character && character.ad && !character.ad.updated))
                async.parallel([
                    function (callback) {
                        characterService.insertOrUpdateAd(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, 0, wowProgressCharacterAd, function (error) {
                            callback(error);
                        });
                    },
                    function (callback) {
                        characterUpdateModel.insertOrUpdate(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, 10, function (error) {
                            if (!error)
                                logger.info("Insert character to update " + wowProgressCharacterAd.region + "-" + wowProgressCharacterAd.realm + "-" + wowProgressCharacterAd.name+" priority 10");
                            callback(error);
                        });
                    },
                    function (callback) {
                        if (wowProgressCharacterAd.guild)
                            guildUpdateModel.insertOrUpdate(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.guild, 10, function (error) {
                                if (!error)
                                    logger.info("Insert guild to update " + wowProgressCharacterAd.region + "-" + wowProgressCharacterAd.realm + "-" + wowProgressCharacterAd.name+" priority 10");
                                callback(error);
                            });
                        else
                            callback();
                    }
                ], function (error) {
                    callback(error);
                });
            else{
                logger.debug("Character is already in datase " + wowProgressCharacterAd.region + "-" + wowProgressCharacterAd.realm + "-" + wowProgressCharacterAd.guild);
                callback();
            }
        }
    ],function(error){
        callback(error);
    });
};

module.exports.refreshAll = function(callback){

    var filters = {};
    filters.wowProgress = true;
    async.waterfall([
        function(callback){
            characterService.getAds(-1,filters,function(error,characterAds){
                if(error)
                    return callback();
                async.forEachSeries(characterAds,function(characterAd, callback) {
                    logger.debug("Checking wowprogress update for character"+characterAd.region+"-"+characterAd.realm+"-"+characterAd.name);
                    wowprogressAPI.parseCharacter(characterAd.region, characterAd.realm, characterAd.name, function (error, result) {
                        if(result && result.lfg == false ){
                            characterService.deleteAd(characterAd.region,characterAd.realm,characterAd.name,0,function(){
                                logger.info("Delete wowprogress characterAd (no longer lfg) "+characterAd.region+"-"+characterAd.realm+"-"+characterAd.name);
                                callback();
                            });
                        }
                        else {
                            logger.debug("Nothing todo "+characterAd.region+"-"+characterAd.realm+"-"+characterAd.name);
                            callback();
                        }
                    });
                }, function () {
                    callback();
                });
            });
        },
        function(callback) {
            guildService.getAds(-1, filters, function (error, guildAds) {
                if (error)
                    return callback();
                async.forEachSeries(guildAds, function (guildAd, callback) {
                    logger.debug("Checking wowprogress update for guild " + guildAd.region + "-" + guildAd.realm + "-" + guildAd.name);
                    wowprogressAPI.parseGuild(guildAd.region, guildAd.realm, guildAd.name, function (error, result) {
                        if (result && result.lfg == false) {
                            guildService.deleteAd(guildAd.region, guildAd.realm, guildAd.name, 0, function () {
                                logger.info("Delete wowprogress guildAd (no longer lfg) " + guildAd.region + "-" + guildAd.realm + "-" + guildAd.name);
                                callback();
                            });
                        }
                        else {
                            logger.debug("Nothing todo " + guildAd.region + "-" + guildAd.realm + "-" + guildAd.name);
                            callback();
                        }
                    });
                },function(){
                    callback();
                });
            });
        }
    ],function(){
        callback();
    });

};


