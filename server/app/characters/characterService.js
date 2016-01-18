"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var userService = process.require("users/userService.js");
var updateModel = process.require("updates/updateModel.js");
var bnetAPI = process.require("core/api/bnet.js");
var warcraftLogsAPI = process.require("core/api/warcraftLogs.js");

/**
 * Sanitize and set the user's id to the character
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.sanitizeAndSetId = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            bnetAPI.getCharacter(region,realm,name,[],function(error,character){
                callback(error,character);
            });
        },
        function(character,callback){
            characterModel.setId(region,character.realm,character.name,id,function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Update WarcraftLogs
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.updateWarcraftLogs = function(region,realm,name,callback){
    var logger = applicationStorage.logger;
    async.waterfall([
        function(callback){
            warcraftLogsAPI.getRankings(region, realm, name, function (error, warcraftLogs) {
                callback(error, warcraftLogs)
            });
        },
        function(warcraftLogs,callback) {
            characterModel.upsertWarcraftLogs(region,realm,name,warcraftLogs, function (error) {
                logger.info('Upsert wlogs for character %s-%s-%s',region,realm,name);
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};


module.exports.insertWoWProgressCharacterAd = function(wowProgressCharacterAd,callback){
    var logger = applicationStorage.logger;
    async.waterfall([
        function(callback) {
            bnetAPI.getCharacter(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, [],function (error, character) {
                callback(error,character);
            });
        },
        function(character,callback) {
            //Force name with bnet response (case or russian realm name)
            wowProgressCharacterAd.realm = character.realm;
            wowProgressCharacterAd.name = character.name;
            characterModel.findOne({region:wowProgressCharacterAd.region, realm:wowProgressCharacterAd.realm, name:wowProgressCharacterAd.name},{ad:1}, function (error, character) {
                callback(error,character);
            });
        },
        function(character,callback) {
            if (!character || (character && !character.ad) || (character && character.ad && !character.ad.updated))
                async.parallel([
                    function (callback) {
                        characterModel.upsertAd(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, wowProgressCharacterAd, function (error) {
                            callback(error);
                        });
                    },
                    function (callback) {
                        updateModel.insert('cu',wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, 10, function (error) {
                            if (!error)
                                logger.info("Insert character to update %s-%s-%s with priority 10",wowProgressCharacterAd.region,wowProgressCharacterAd.realm,wowProgressCharacterAd.name);
                            callback(error);
                        });
                    }
                ], function (error) {
                    callback(error);
                });
            else{
                callback();
            }
        }
    ],function(error){
        callback(error);
    });
};