"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var userService = process.require("users/userService.js");
var updateModel = process.require("updates/updateModel.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");
var bnetAPI = process.require("core/api/bnet.js");

/**
 * Sanitize and set the user's id to the character
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.sanitizeAndSetId = function (region, realm, name, id, callback) {
    async.waterfall([
        function (callback) {
            bnetAPI.getCharacter(region, realm, name, [], function (error, character) {
                callback(error, character);
            });
        },
        function (character, callback) {
            characterModel.setId(region, character.realm, character.name, id, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};

/**
 * Insert an ad from wowProgress
 * @param wowProgressCharacterAd
 * @param callback
 */
module.exports.insertWoWProgressCharacterAd = function (wowProgressCharacterAd, callback) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            bnetAPI.getCharacter(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, [], function (error, character) {
                callback(error, character);
            });
        },
        function (character, callback) {
            //Force name with bnet response (case or russian realm name)
            wowProgressCharacterAd.realm = character.realm;
            wowProgressCharacterAd.name = character.name;
            characterModel.findOne({
                region: wowProgressCharacterAd.region,
                realm: wowProgressCharacterAd.realm,
                name: wowProgressCharacterAd.name
            }, {ad: 1}, function (error, character) {
                callback(error, character);
            });
        },
        function (character, callback) {
            if (!character || (character && !character.ad) || (character && character.ad && !character.ad.updated)) {
                async.parallel([
                    function (callback) {
                        wowProgressCharacterAd.updated = new Date().getTime();
                        wowProgressCharacterAd.updated = wowProgressCharacterAd.updated - ((Math.floor(Math.random() * 30) + 30)*60*1000);
                        characterModel.upsert(wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, {ad:wowProgressCharacterAd}, function (error) {
                            callback(error);
                        });
                    },
                    function (callback) {
                        updateModel.insert('cu', wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name, 10, function (error) {
                            if (!error) {
                                logger.info("Insert character to update %s-%s-%s with priority 10", wowProgressCharacterAd.region, wowProgressCharacterAd.realm, wowProgressCharacterAd.name);
                            }
                            callback(error);
                        });
                    }
                ], function (error) {
                    callback(error);
                });
            } else {
                callback();
            }
        }
    ], function (error) {
        callback(error);
    });
};

module.exports.putLfgAdsInUpdateList = function(callback){
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            characterModel.find({"ad.lfg": true}, {region: 1, realm: 1, name: 1}, function (error, characters) {
                callback(error, characters);
            });
        },
        function (characters, callback) {
            async.each(characters, function (character, callback) {
                updateModel.insert('cu', character.region, character.realm, character.name, 3, function (error) {
                    logger.verbose("Insert character to update %s-%s-%s to update with priority 3", character.region, character.realm, character.name);
                    callback(error);
                });
            }, function (error) {
                callback(error, characters.length);
            });
        }
    ], function (error, length) {
        if (error && error !== true) {
            logger.error(error.message);
        } else {
            logger.info("Added %s characters to update", length)
        }
        callback();
    });
};

module.exports.refreshWowProgressAds = function(callback){
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            characterModel.find(
                {
                    "ad.lfg": true, id: {$exists: false}
                }, {region: 1, realm: 1, name: 1}, {"ad.updated": 1}, function (error, characters) {
                    callback(error, characters);

                });
        },
        function (characters, callback) {
            async.forEachSeries(characters, function (character, callback) {
                logger.info("Checking wowprogress Character Ad update %s-%s-%s", character.region, character.realm, character.name);
                wowProgressAPI.parseCharacter(character.region, character.realm, character.name, function (error, ad) {
                    if (error) {
                        logger.error(error.message);
                        callback();
                    }
                    else if (ad && ad.lfg == false) {
                        logger.info("Set LFG to false for wowprogress Character Ad %s-%s-%s", character.region, character.realm, character.name);
                        characterModel.upsert(character.region, character.realm, character.name, {"ad": ad}, function (error) {
                            if (error) {
                                logger.error(error.message);
                            }
                            callback();
                        });
                    }
                    else {
                        callback();
                    }
                });
            }, function () {
                callback();
            });
        }
    ], function (error) {
        if (error) {
            logger.error(error.message);
        }
        callback();
    });
};

