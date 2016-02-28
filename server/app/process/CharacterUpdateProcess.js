"use strict";

//Load dependencies
var async = require("async");
var moment = require('moment-timezone');
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var warcraftLogsAPI = process.require("core/api/warcraftLogs.js");
var limitModel = process.require("limits/limitModel.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var characterModel = process.require("characters/characterModel.js");
var characterService = process.require("characters/characterService.js");


/**
 * CharacterUpdateProcess constructor
 * @constructor
 */
function CharacterUpdateProcess() {
}

/**
 * Update one character
 */
CharacterUpdateProcess.prototype.updateCharacter = function () {

    var logger = applicationStorage.logger;
    var self = this;
    async.waterfall([
        function (callback) {
            //Get next guild to update
            updateService.getNextUpdate('cu', function (error, characterUpdate) {
                if (characterUpdate == null) {
                    //Guild update is empty
                    logger.info("No character to update ... waiting 3 sec");
                    setTimeout(function () {
                        callback(true);
                    }, 3000);
                } else {
                    logger.info("Update character %s-%s-%s", characterUpdate.region, characterUpdate.realm, characterUpdate.name);
                    callback(error, characterUpdate);
                }
            });
        },
        function (characterUpdate, callback) {
            //Check if max request is reach - CharacterUpdateProcess take 1 request to Bnet
            limitModel.increment("bnet", function (error, value) {
                if (value > applicationStorage.config.oauth.bnet.limit) {
                    logger.info("Bnet Api limit reach ... waiting 1 min");
                    updateModel.insert("cu", characterUpdate.region, characterUpdate.realm, characterUpdate.name, characterUpdate.priority, function () {
                        setTimeout(function () {
                            callback(true);
                        }, 60000);
                    });
                }
                else {
                    callback(error, characterUpdate);
                }
            });
        },
        function (characterUpdate, callback) {
            //Sanitize name
            bnetAPI.getCharacter(characterUpdate.region, characterUpdate.realm, characterUpdate.name, ["guild", "items", "progression", "talents", "achievements", "statistics", "challenge", "pvp", "reputation", "stats"], function (error, character) {
                if (character && character.realm && character.name) {
                    callback(error, characterUpdate.region, character);
                } else {
                    logger.warn("Bnet return empty character (account inactive...), skip it");
                    callback(true);
                }
            })
        },
        function (region, character, callback) {
            async.parallel({
                ad: function (callback) {
                    async.waterfall([
                        function (callback) {
                            characterModel.findOne({
                                region: region,
                                realm: character.realm,
                                name: character.name
                            }, {ad: 1}, function (error, character) {
                                callback(error, character);
                            });
                        },
                        function (character, callback) {
                            if (character && character.ad && character.ad.timezone && character.ad.lfg == true) {
                                var offset = Math.round(moment.tz.zone(character.ad.timezone).parse(Date.UTC()) / 60);
                                async.each(character.ad.play_time, function (day, callback) {
                                    day.start.hourUTC = day.start.hour + offset;
                                    day.end.hourUTC = day.end.hour + offset;
                                    callback();
                                }, function () {
                                    callback(null, character.ad);
                                });
                            } else {
                                callback();
                            }
                        }
                    ], function (error, ad) {
                        if (error) {
                            logger.error(error.message);
                        }
                        callback(null, ad);
                    });
                },
                warcraftLogs: function (callback) {
                    //Get WarcraftLogs
                    warcraftLogsAPI.getRankings(region, character.realm, character.name, function (error, warcraftLogs) {
                        var tmpObj = {};
                        if (error && error !== true) {
                            logger.error(error.message);
                        }
                        tmpObj.logs = warcraftLogs;
                        tmpObj.updated = new Date().getTime();
                        callback(null, tmpObj)
                    });
                },
                progress: function (callback) {
                    //Get Progress
                    characterService.getProgress(region, character, function (error, progress) {
                        if (error && error !== true) {
                            logger.error(error.message);
                        }
                        if (progress) {
                            progress.updated = new Date().getTime();
                        }
                        callback(null, progress);
                    });
                }
            }, function (error, results) {
                results.bnet = character;
                results.bnet.updated = new Date().getTime();
                characterModel.upsert(region, character.realm, character.name, results, function (error) {
                    callback(error);
                });
            });
        }
    ], function (error) {
        if (error && error !== true) {
            logger.error(error.message);
        }
        self.updateCharacter();
    });
};

/**
 * Start characterUpdateProcess
 * @param callback
 */
CharacterUpdateProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting CharacterUpdateProcess");
    this.updateCharacter();
    callback();
};

module.exports = CharacterUpdateProcess;
