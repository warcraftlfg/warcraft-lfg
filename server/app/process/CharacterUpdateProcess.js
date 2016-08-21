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
                results.parser = self.parseCharacter(character);
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
 * Update one character
 */
CharacterUpdateProcess.prototype.parseCharacter = function (character) {
    // Parser
    var parser = {};

    // Suramar WQ unlock
    if (character.achievements) {
        var achievement = character.achievements.achievementsCompleted.indexOf(10617);
        if (achievement >= 0) {
            parser.suramarWQ = 6;
            parser.suramarWQTime = character.achievements.achievementsCompletedTimestamp[achievement];
        } else {
            parser.suramarWQ = 0;
            if (character.achievements.criteria.indexOf(40009)) {
                parser.suramarWQ++;
            }
            if (character.achievements.criteria.indexOf(40956)) {
                parser.suramarWQ++;
            }
            if (character.achievements.criteria.indexOf(42147)) {
                parser.suramarWQ++;
            }
            if (character.achievements.criteria.indexOf(41760)) {
                parser.suramarWQ++;
            }
            if (character.achievements.criteria.indexOf(41138)) {
                parser.suramarWQ++;
            }
            if (character.achievements.criteria.indexOf(42230)) {
                parser.suramarWQ++;
            }
        }
    }

    // Class Order Campaign
    if (character.achievements) {
        var achievement = character.achievements.achievementsCompleted.indexOf(10994);
        if (achievement >= 0) {
            parser.classOrderCampaign = true
            parser.classOrderCampaignTime = character.achievements.achievementsCompletedTimestamp[achievement];
        } else {
            parser.classOrderCampaign = false;
        }
    }

    // COS unlock
    if (character.quests && character.quests.indexOf(43314)) {
        parser.suramarDungeonCOS = true;
    } else {
        parser.suramarDungeonCOS = false;
    }

    // Arcway unlock
    if (character.quests && character.quests.indexOf(44053)) {
        parser.suramarDungeonArcway = true;
    } else {
        parser.suramarDungeonArcway = false;
    }

    // Reputation Suramar
    for (var i = 0; i < character.reputation.length; i++) {
        if (character.reputation[i].name == "The Nightfallen") {
            parser.suramarReputation = character.reputation[i];
        }
    }

    // Legendary
    parser.legendary = 0;
    for (var i = 0; i < character.items.length; i++) {
        if (character.items[i].quality && character.items[i].quality == 5) {
            parser.legendary++;
        }
    }

    // T19
    parser.t19 = 0;

    // WCL

    // Audit

    return parser;
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
