"use strict";

//Load dependencies
var async = require("async");
var moment = require('moment-timezone');
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var warcraftLogsAPI = process.require("core/api/warcraftLogs.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var characterModel = process.require("characters/characterModel.js");
var characterService = process.require("characters/characterService.js");
var characterParsing = process.require("characters/characterParsing.js");
var realmModel = process.require("realms/realmModel.js")

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
                    //Character update is empty
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
            //Sanitize name
            bnetAPI.getCharacter(characterUpdate.region, characterUpdate.realm, characterUpdate.name, ["guild", "items", "progression", "talents", "achievements", "statistics", "challenge", "pvp", "reputation", "stats", "quests"], function (error, character) {
                if (character && character.realm && character.name) {
                    callback(error, characterUpdate.region, character);
                } else {
                    logger.warn("Bnet return empty character (account inactive...), skip it");
                    callback(true);
                }
            })
        },
        function (region, character, callback) {
            realmModel.findOne({region: region, name: character.realm}, {"bnet.slug": 1}, function(error, realm) {
                if (realm && realm.bnet && realm.bnet.slug) {
                    callback(error, region, character, realm.bnet.slug);
                } else {
                    logger.warn("Can't find realm slug for realm!");
                    callback(true);                  
                }
            });
        },
        function (region, character, realmSlug, callback) {
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
                warcraftLogsDps: function (callback) {
                    //Get WarcraftLogs
                    warcraftLogsAPI.getRankings(region, realmSlug, character.name, 'dps', '10', function (error, warcraftLogs) {
                        var tmpObj = {};
                        if (error && error !== true) {
                            logger.error(error.message);
                            tmpObj.logs = null;
                            tmpObj.updated = new Date().getTime();
                        } else {
                            tmpObj.logs = warcraftLogs;
                            tmpObj.updated = new Date().getTime();
                        }
                        callback(null, tmpObj);
                    });
                },
                warcraftLogsHps: function (callback) {
                    //Get WarcraftLogs
                    warcraftLogsAPI.getRankings(region, realmSlug, character.name, 'hps', '10', function (error, warcraftLogs) {
                        var tmpObj = {};
                        if (error && error !== true) {
                            logger.error(error.message);
                            tmpObj.logs = null;
                            tmpObj.updated = new Date().getTime();
                        } else {
                            tmpObj.logs = warcraftLogs;
                            tmpObj.updated = new Date().getTime();
                        }
                        callback(null, tmpObj);
                    });
                },
                warcraftLogsDps2: function (callback) {
                    //Get WarcraftLogs
                    warcraftLogsAPI.getRankings(region, realmSlug, character.name, 'dps', '12', function (error, warcraftLogs) {
                        var tmpObj = {};
                        if (error && error !== true) {
                            logger.error(error.message);
                            tmpObj.logs = null;
                            tmpObj.updated = new Date().getTime();
                        } else {
                            tmpObj.logs = warcraftLogs;
                            tmpObj.updated = new Date().getTime();
                        }
                        callback(null, tmpObj);
                    });
                },
                warcraftLogsHps2: function (callback) {
                    //Get WarcraftLogs
                    warcraftLogsAPI.getRankings(region, realmSlug, character.name, 'hps', '12', function (error, warcraftLogs) {
                        var tmpObj = {};
                        if (error && error !== true) {
                            logger.error(error.message);
                            tmpObj.logs = null;
                            tmpObj.updated = new Date().getTime();
                        } else {
                            tmpObj.logs = warcraftLogs;
                            tmpObj.updated = new Date().getTime();
                        }
                        callback(null, tmpObj);
                    });
                },
                progress: function (callback) {
                    var progress = {score:0}
                    if (character.progression && character.progression.raids) {
                        character.progression.raids[character.progression.raids.length - 3].bosses.forEach(function(boss){
                            if(boss.normalKills>0){
                                progress.score += 1000;
                            }
                            if(boss.heroicKills>0){
                                progress.score+=100000
                            }
                            if(boss.mythicKills>0){
                                progress.score+=10000000
                            }
                        });
                        callback(null,progress);
                    }
                    else {
                        callback();
                    }
                }
            }, function (error, results) {
                // Time taken start
                //var start = new Date().getTime();

                // Parser achievements & co
                results.parser = characterParsing.parseCharacter(character);

                // Set current specialization
                characterParsing.parseCharacterTalents(character);

                if (results.warcraftLogsDps2 && results.warcraftLogsDps2.logs && results.warcraftLogsDps2.logs.length > 0) {
                    results.warcraftLogsDps.logs = results.warcraftLogsDps.logs.concat(results.warcraftLogsDps2.logs);
                }

                if (results.warcraftLogsHps2 && results.warcraftLogsHps2.logs && results.warcraftLogsHps2.logs.length > 0) {
                    results.warcraftLogsHps.logs = results.warcraftLogsHps.logs.concat(results.warcraftLogsHps2.logs);
                }

                // Clean warcraftLogs
                results.warcraftLogs = {};
                results.warcraftLogs = characterParsing.parseWarcraftLogs(results.warcraftLogsDps, results.warcraftLogsHps, character.class);

                // Too many data, let's remove
                character.achievements = null;
                character.quests = null;

                // Set bnet info
                results.bnet = character;
                results.bnet.updated = new Date().getTime();

                // Time taken end
                /*var end = new Date().getTime();
                var time = end - start;
                console.log('Execution time: ' + time);*/

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
