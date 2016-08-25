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
                results.parser = self.parseCharacter(character, results.warcraftLogs);

                // Too many data, let's remove
                character.achievements = null;
                character.quests = null;

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
 * Parse one character
 */
CharacterUpdateProcess.prototype.parseCharacter = function (character, warcraftLogs) {
    var self = this;

    // Parser
    var parser = {};

    // Suramar WQ unlock
    parser.suramar = {};
    if (character.achievements) {
        var achievement = character.achievements.achievementsCompleted.indexOf(10617);
        if (achievement >= 0) {
            parser.suramar.worldQuest = 6;
            parser.suramar.worldQuestTimestamp = character.achievements.achievementsCompletedTimestamp[achievement];
        } else {
            parser.suramar.worldQuest = 0;
            if (character.quests.indexOf(40009) >= 0) {
                parser.suramar.worldQuest++;
            }
            if (character.quests.indexOf(40956) >= 0) {
                parser.suramar.worldQuest++;
            }
            if (character.quests.indexOf(42147) >= 0) {
                parser.suramar.worldQuest++;
            }
            if (character.quests.indexOf(41760) >= 0) {
                parser.suramar.worldQuest++;
            }
            if (character.quests.indexOf(41138) >= 0) {
                parser.suramar.worldQuest++;
            }
            if (character.quests.indexOf(42230) >= 0) {
                parser.suramar.worldQuest++;
            }
        }
    }

    // Suramar COS unlock
    if (character.quests && character.quests.indexOf(43314) >= 0) {
        parser.suramar.courtOfStar = true;
    }

    // Suramar Arcway unlock
    if (character.quests && character.quests.indexOf(44053) >= 0) {
        parser.suramar.arcway = true;
    }

    // Reputation Suramar
    for (var i = 0; i < character.reputation.length; i++) {
        if (character.reputation[i].name == "The Nightfallen") {
            parser.suramar.reputation = character.reputation[i];
        }
    }

    // Class Order Campaign
    if (character.achievements) {
        var achievement = character.achievements.achievementsCompleted.indexOf(10994);
        if (achievement >= 0) {
            parser.classOrderCampaign = true
            parser.classOrderCampaignTimestamp = character.achievements.achievementsCompletedTimestamp[achievement];
        }
    }

    // Obliterum forge
    if (character.achievements) {
        var achievement = character.achievements.achievementsCompleted.indexOf(10585);
        if (achievement >= 0) {
            parser.obliterumForge = true;
            parser.obliterumForgeTimestamp = character.achievements.achievementsCompletedTimestamp[achievement];
        }
    }

    // Legendary
    parser.legendary = 0;
    for (var i = 0; i < character.items.length; i++) {
        if (character.items[i].quality && character.items[i].quality == 5 && character.items[i].itemLevel > 850) {
            parser.legendary++;
        }
    }

    // Artifact trait
    parser.artifact = {trait: 0, knowledge: 0, relic: 0};
    if (character.bnet && character.bnet.items && character.bnet.items.mainHand) {
        parser.artifact.relic = character.bnet.items.mainHand.relics.length;
    }

    // T19
    parser.t19 = 0;

    // WCL

    // Audit

    // Proving Grounds
    parser.provingGrounds = {};
    parser.provingGrounds.tank = self.parseCharacterProvingGrounds(character.achievements, 'tank');
    parser.provingGrounds.dps = self.parseCharacterProvingGrounds(character.achievements, 'dps');
    parser.provingGrounds.healer = self.parseCharacterProvingGrounds(character.achievements, 'tank');

    parser.challenge = {};
    parser.challenge.gold = self.parseCharacterChallengeMedal(character.achievements, 'gold');
    parser.challenge.silver = self.parseCharacterChallengeMedal(character.achievements, 'silver');
    parser.challenge.copper = self.parseCharacterChallengeMedal(character.achievements, 'copper');

    if (warcraftLogs && warcraftLogs.logs) {
        parser.warcraftLogs = self.parseWarcraftLogs(warcraftLogs.logs, character.class);
    } else {
        parser.warcraftLogs = {average: 0};
    }

    return parser;
};

/**
 * Parse ProvingGround (WOD)
 */
CharacterUpdateProcess.prototype.parseCharacterProvingGrounds = function (achievements, type) {
    var statId = {
        'tank': [9578, 9579, 9580, 26345],
        'dps': [9572, 9573, 9574, 26344],
        'healer': [9584, 9585, 9586, 26346]
    };

    var criteriaId;

    var data = {};

    data.best = 0;

    if (achievements && achievements.achievementsCompleted) {
        if (achievements.achievementsCompleted.indexOf(statId[type][2]) != -1) {
            data.gold = true;
            if ((criteriaId = achievements.criteria.indexOf(statId[type][3])) != -1) {
                data.best = achievements.criteria[criteriaId];
            }
        } else if (achievements.achievementsCompleted.indexOf(statId[type][1]) != -1) {
            data.silver = true;
        } else if (achievements.achievementsCompleted.indexOf(statId[type][0]) != -1) {
            data.copper = true;
        }
    }

    return data;

}

/**
 * Parse ProvingGround (WOD)
 */
CharacterUpdateProcess.prototype.parseCharacterChallengeMedal = function (achievements, type) {
    var statId = {
        'gold': [8878, 8882, 9004, 8886, 9000, 8874, 8890, 8894],
        'silver': [8877, 8881, 9003, 8885, 8999, 8873, 8889, 8893],
        'copper': [8876, 8880, 9002, 8884, 8998, 8872, 8888, 8892]
    };

    var data = 0;

    if (achievements && achievements.achievementsCompleted) {
        statId[type].forEach(function(id) {
            if (achievements.achievementsCompleted.indexOf(id) != -1) {
                data++;
            }
        });
    }

    return data;
}

/**
 * Parse WCL
 */
CharacterUpdateProcess.prototype.parseWarcraftLogs = function (logs, characterClass) {
    var self = this;

    var classSpec = {
        1: {0: "dps", 1: "dps", 2: "dps", 3: null},
        2: {0: "heal", 1: "tank", 2: "dps", 3: null},
        3: {0: "dps", 1: "dps", 2: "dps", 3: null},
        4: {0: "dps", 1: "dps", 2: "dps", 3: null},
        5: {0: "heal", 1: "heal", 2: "dps", 3: null},
        6: {0: "tank", 1: "dps", 2: "dps", 3: null},
        7: {0: "dps", 1: "dps", 2: "heal", 3: null},
        8: {0: "dps", 1: "dps", 2: "dps", 3: null},
        9: {0: "dps", 1: "dps", 2: "dps", 3: null},
        10: {0: "tank", 1: "heal", 2: "dps", 3: null},
        11: {0: "dps", 1: "dps", 2: "tank", 3: "heal"}
    };

    if (logs) {
        var sortedLogs = {3:{0:[],'1':[],'2':[],'3':[]},4:{0:[],'1':[],'2':[],'3':[]},5:{0:[],'1':[],'2':[],'3':[]}};
        var ratioFound = false;
        
        if (logs.dps && logs.dps instanceof Array) {
            logs.dps.forEach(function (log) {
                var ratio = 1-(log.rank/log.outOf);
                if (log.difficulty >= 3 && log.difficulty <= 5 ) {
                    if (classSpec[characterClass][log.spec-1] == "dps" || classSpec[characterClass][log.spec-1] == "tank") {
                        sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                        ratioFound = true;
                    }
                }
            });
        }

        if (logs.hps && logs.hps instanceof Array) {
            logs.hps.forEach(function (log) {
                var ratio = 1-(log.rank/log.outOf);
                if (log.difficulty >= 3 && log.difficulty <= 5 ) {
                    if (classSpec[characterClass][log.spec-1] == "heal") {
                        sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                        ratioFound = true;
                    }
                }
            });
        }

        if (!logs.dps && !logs.hps) {
            logs.forEach(function (log) {
                var ratio = 1-(log.rank/log.outOf);
                if (log.difficulty >= 3 && log.difficulty <= 5 ) {
                    sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                    ratioFound = true;
                }
            });
        }                

        if (ratioFound) {
            var warcraftLogs = {
                5: {0: null, '1': null, '2': null, '3': null},
                4: {0: null, '1': null, '2': null, '3': null},
                3: {0: null, '1': null, '2': null, '3': null},
            };

            var i = 0;
            warcraftLogs.average = 0;
            for (var difficulty = 3; difficulty <= 5; difficulty++) {
                for (var spec = 0; spec <= 3; spec++) {
                    if (sortedLogs[difficulty][spec].length > 0) {
                        i++;
                        warcraftLogs[difficulty][spec] = {median:Math.floor(self.parseWarcraftLogsAverage(sortedLogs[difficulty][spec]) * 100), number: sortedLogs[difficulty][spec].length};
                        warcraftLogs.average += Math.floor(self.parseWarcraftLogsAverage(sortedLogs[difficulty][spec]) * 100);
                    }
                }
            }
            warcraftLogs.average = Math.floor(warcraftLogs.average / i);
        } else {
            var warcraftLogs = {average: 0};
        }
    } else {
        var warcraftLogs = {average: 0};
    }

    return warcraftLogs;
}

/**
 * Parse WCL average
 */
CharacterUpdateProcess.prototype.parseWarcraftLogsAverage = function (values) {
    var sum = 0;
    for( var i = 0; i < values.length; i++ ){
        sum += values[i]; //don't forget to add the base
    }
    return sum/values.length;
}

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
