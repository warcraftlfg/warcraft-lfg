"use strict";

var relicsData = process.require("characters/utilities/relics.js");

/**
 * Parse one character
 */
module.exports.parseCharacter = function (character) {
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

    // Suramar Arcway & COS unlock
    if (character.quests && character.quests.indexOf(44053) >= 0) {
        parser.suramar.arcway = true;
        parser.suramar.courtOfStar = true;
    }

    // Reputation Suramar
    for (var i = 0; i < character.reputation.length; i++) {
        if (character.reputation[i].name == "The Nightfallen") {
            parser.suramar.reputation = character.reputation[i];
        }
    }

    if (parser.suramar.reputation) {
        if (parser.suramar.reputation.standing == 7) {
                parser.suramar.reputation.sort = (50000*7) + parser.suramar.reputation.value;
        } else {
            parser.suramar.reputation.sort = (parser.suramar.reputation.max*parser.suramar.reputation.standing) + parser.suramar.reputation.value;
        }
    }

    if (!parser.suramar.reputation) {
        parser.suramar.reputation = { name: "The Nightfallen", standing: 3, value: "????", max: 3000, sort: 3000 };

        if (character.quests && character.quests.indexOf(43341) >= 0) {
            parser.suramar.reputation = { name: "The Nightfallen", standing: 4, value: "????", max: 6000, sort: 6000, };
        }

        if (character.quests && character.quests.indexOf(44561) >= 0) {
            parser.suramar.reputation = { name: "The Nightfallen", standing: 5, value: "????", max: 12000, sort: 12000 };
        }

        if (character.quests && character.quests.indexOf(44562) >= 0) {
            parser.suramar.reputation = { name: "The Nightfallen", standing: 6, value: "????", max: 21000, sort: 21000 };
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
    parser.legendary =  {count: 0, items: []};

    // T19
    parser.t19 = 0;
    var t19 = {
        1: "Obsidian Aspect",
        2: "Highlord",
        3: "Eagletalon",
        4: "Doomblade",
        5: "Purifier",
        6: "Dreadwyrm",
        7: "Shackled Elements",
        8: "Everburning Knowledge",
        9: "Azj'Aqir",
        10: "Enveloped Dissonance",
        11: "Astral Warden",
        12: "Second Sight",
    };

    // Legendary + T19
    var itemSlot = Object.keys( character.items );
    for( var i = 0,length = itemSlot.length; i < length; i++ ) {
        if (character.items[itemSlot[i]].quality && character.items[itemSlot[i]].quality === 5 && character.items[itemSlot[i]].itemLevel > 850) {
            parser.legendary.count++;
            parser.legendary.items.push(character.items[itemSlot[i]]);
        }

        if (character.items[itemSlot[i]].name && character.items[itemSlot[i]].name.indexOf(t19[character.class]) >= 0) {
            parser.t19++;
        }
    }

    // Artifact trait
    parser.artifact = {trait: 0, knowledge: 0, relic: 0};
    if (character.items && character.items.mainHand) {
        var weaponArtifact = character.items.mainHand;
        if (weaponArtifact.artifactId == 0 &&  character.items.offHand && character.items.offHand.artifactId && character.items.offHand.artifactId > 0) {
            weaponArtifact = character.items.offHand;
        }

        parser.artifact.relic = weaponArtifact.relics.length;

        var traitCount = 0;
        var relics = relicsData.getData();
        var traitModified = 0;
        weaponArtifact.artifactTraits.forEach(function(trait) {
        	if (weaponArtifact.relics[0] && relics[weaponArtifact.relics[0].itemId] && relics[weaponArtifact.relics[0].itemId].indexOf(trait.id) >= 0) {
        		traitModified++;
                if (trait && trait.rank) {
                    trait.rank--;
                }
        	}

            if (weaponArtifact.relics[1] && relics[weaponArtifact.relics[1].itemId] && relics[weaponArtifact.relics[1].itemId].indexOf(trait.id) >= 0) {
                traitModified++;
                if (trait && trait.rank) {
                    trait.rank--;
                }
            }

            if (weaponArtifact.relics[2] && relics[weaponArtifact.relics[2].itemId] && relics[weaponArtifact.relics[2].itemId].indexOf(trait.id) >= 0) {
                traitModified++;
                if (trait && trait.rank) {
                    trait.rank--;
                }
            }

            if (trait && trait.rank) {
                traitCount += trait.rank;
            }
        });

        if (character.items && weaponArtifact) {
            weaponArtifact.artifactTotal = traitCount;
        }

        parser.artifact.trait = traitCount;
    }

    // WCL

    // Audit

    // Mythic 
    parser.mythic = {};
    parser.mythic.dungeon = {};
    if (character.statistics.subCategories[5] && character.statistics.subCategories[5].subCategories[6]) {
        var dungeonLegion = character.statistics.subCategories[5].subCategories[6];
        parser.mythic.dungeon.eoa = (dungeonLegion.statistics[2]) ? dungeonLegion.statistics[2].quantity : 0;
        parser.mythic.dungeon.dht = (dungeonLegion.statistics[5]) ? dungeonLegion.statistics[5].quantity : 0;
        parser.mythic.dungeon.nl = (dungeonLegion.statistics[8]) ? dungeonLegion.statistics[8].quantity : 0;
        parser.mythic.dungeon.hov = (dungeonLegion.statistics[11]) ? dungeonLegion.statistics[11].quantity : 0;
        //parser.mythic.dungeon.vh = (dungeonLegion.statistics[16] && dungeonLegion.statistics[17]) ? dungeonLegion.statistics[16].quantity + dungeonLegion.statistics[17].quantity : 0;
        parser.mythic.dungeon.vow = (dungeonLegion.statistics[20]) ? dungeonLegion.statistics[20].quantity : 0;
        parser.mythic.dungeon.brh = (dungeonLegion.statistics[23]) ? dungeonLegion.statistics[23].quantity : 0;
        parser.mythic.dungeon.mos = (dungeonLegion.statistics[26]) ? dungeonLegion.statistics[26].quantity : 0;
        parser.mythic.dungeon.arcway = (dungeonLegion.statistics[29]) ? dungeonLegion.statistics[29].quantity : 0;
        parser.mythic.dungeon.cos = (dungeonLegion.statistics[32]) ? dungeonLegion.statistics[32].quantity : 0;

        parser.mythic.total = 0;
        var dungeon = Object.keys( parser.mythic.dungeon );
        for( var i = 0, length = dungeon.length; i < length; i++ ) {
                parser.mythic.total += parseInt(parser.mythic.dungeon[dungeon[i]]);
        }
    }

    // Mythic+
    var key;
    key = character.achievements.criteria.indexOf(33096)
    parser.mythic.level2 = (key >= 0) ? character.achievements.criteriaQuantity[key] : 0;
    key = character.achievements.criteria.indexOf(33097)
    parser.mythic.level5 = (key >= 0) ? character.achievements.criteriaQuantity[key] : 0;
    key = character.achievements.criteria.indexOf(33098)
    parser.mythic.level10 = (key >= 0) ? character.achievements.criteriaQuantity[key] : 0;
    key = character.achievements.criteria.indexOf(32028)
    parser.mythic.level15 = (key >= 0) ? character.achievements.criteriaQuantity[key] : 0;

    // Proving Grounds
    parser.provingGrounds = {};
    parser.provingGrounds.tank = self.parseCharacterProvingGrounds(character.achievements, 'tank');
    parser.provingGrounds.dps = self.parseCharacterProvingGrounds(character.achievements, 'dps');
    parser.provingGrounds.healer = self.parseCharacterProvingGrounds(character.achievements, 'tank');

    parser.challenge = {};
    parser.challenge.gold = self.parseCharacterChallengeMedal(character.achievements, 'gold');
    parser.challenge.silver = self.parseCharacterChallengeMedal(character.achievements, 'silver');
    parser.challenge.copper = self.parseCharacterChallengeMedal(character.achievements, 'copper');

    return parser;
};

/**
 * Parse ProvingGround (WOD)
 */
module.exports.parseCharacterProvingGrounds = function (achievements, type) {
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
 * Parse ChallengeMedal (WOD)
 */
module.exports.parseCharacterChallengeMedal = function (achievements, type) {
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
module.exports.parseWarcraftLogs = function (wclDps, wclHps, characterClass) {
    var self = this;

    var classSpecStr ={
        1: {"Arms": 0, "Fury": 1, "Protection": 2},
        2: {"Holy": 0, "Protection": 1, "Retribution": 2},
        3: {"BeastMastery": 0, "Marksmanship": 1, "Survival": 2},
        4: {"Assassination": 0, "Outlaw": 1, "Combat": 1, "Subtlety": 2},
        5: {"Discipline": 0, "Holy": 1, "Shadow": 2},
        6: {"Blood": 0, "Frost": 1, "Unholy": 2},
        7: {"Elemental": 0, "Enhancement": 1, "Restoration": 2},
        8: {"Arcane": 0, "Fire": 1, "Frost": 2},
        9: {"Affliction": 0, "Demonology": 1, "Destruction": 2},
        10: {"Brewmaster": 0, "Mistweaver": 1, "Windwalker": 2},
        11: {"Balance": 0, "Feral": 1, "Guardian": 2, "Restoration": 3},
        12: {"Havoc": 0, "Vengeance": 1}
    }

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
        11: {0: "dps", 1: "dps", 2: "tank", 3: "heal"},
        12: {0: "dps", 1: "tank", 2: null, 3: null}
    };

    if (wclDps || wclHps) {
        var warcraftLogs = {bosses: {}, difficulty: {3:{},4:{},5:{}}, 'bestHighSpec': {}, 'bestAllSpec': {}};
        
        // DPS
        if (wclDps.logs && wclDps.logs instanceof Array) {
            wclDps.logs.forEach(function (log) {
                if (log.name && !warcraftLogs.bosses[log.name]) {
                    warcraftLogs.bosses[log.name] = {difficulty: {3:{0: null,'1': null,'2': null,'3':null},4:{0: null,'1':null,'2': null,'3': null},5:{0: null,'1': null,'2': null,'3': null}}};
                }

                if (log.difficulty >= 3 && log.difficulty <= 5) {
                    log.specs.forEach(function (spec) {
                        if (!spec.combined) {
                            var specNumber = classSpecStr[characterClass][spec.spec]; 

                            if (spec.spec && !warcraftLogs.difficulty[log.difficulty][specNumber]) {
                                warcraftLogs.difficulty[log.difficulty][specNumber] = {kill: 0, average: 0, median: 0, best: 0, number: 0};
                            }

                            if (log.name && log.difficulty && characterClass && spec.spec) {
                                if (classSpec[characterClass][specNumber] == "dps" || classSpec[characterClass][specNumber] == "tank") {
                                    warcraftLogs.bosses[log.name].difficulty[log.difficulty][specNumber] = {kill: spec.historical_total, average: Math.round(spec.historical_avg), median: Math.round(spec.historical_median), best: Math.round(spec.best_historical_percent)};
                                    warcraftLogs.difficulty[log.difficulty][specNumber].kill += spec.historical_total;
                                    warcraftLogs.difficulty[log.difficulty][specNumber].average += Math.round(spec.historical_avg);
                                    warcraftLogs.difficulty[log.difficulty][specNumber].median += Math.round(spec.historical_median);
                                    warcraftLogs.difficulty[log.difficulty][specNumber].best += Math.round(spec.best_historical_percent);
                                    warcraftLogs.difficulty[log.difficulty][specNumber].number += 1;
                                }
                            }
                        }
                    });
                }
            });
        }

        // Healer
        if (wclHps.logs && wclHps.logs instanceof Array) {
            wclHps.logs.forEach(function (log) {
                if (log.name && !warcraftLogs.bosses[log.name]) {
                    warcraftLogs.bosses[log.name] = {difficulty: {3:{0: null,'1': null,'2': null,'3':null},4:{0: null,'1':null,'2': null,'3': null},5:{0: null,'1': null,'2': null,'3': null}}};
                }

                if (log.difficulty >= 3 && log.difficulty <= 5) {
                    log.specs.forEach(function (spec) {
                        if (!spec.combined) {
                            var specNumber = classSpecStr[characterClass][spec.spec];

                            if (spec.spec && !warcraftLogs.difficulty[log.difficulty][specNumber]) {
                                warcraftLogs.difficulty[log.difficulty][specNumber] = {kill: 0, average: 0, median: 0, best: 0, number: 0};
                            }

                            if (log.name && log.difficulty && characterClass && spec.spec) {
                                if (classSpec[characterClass][specNumber] == "heal") {
                                    warcraftLogs.bosses[log.name].difficulty[log.difficulty][specNumber] = {kill: spec.historical_total, average: Math.round(spec.historical_avg), median: Math.round(spec.historical_median), best: Math.round(spec.best_historical_percent)};
                                    warcraftLogs.difficulty[log.difficulty][specNumber].kill += spec.historical_total;
                                    warcraftLogs.difficulty[log.difficulty][specNumber].average += Math.round(spec.historical_avg);
                                    warcraftLogs.difficulty[log.difficulty][specNumber].median += Math.round(spec.historical_median);
                                    warcraftLogs.difficulty[log.difficulty][specNumber].best += Math.round(spec.best_historical_percent);
                                    warcraftLogs.difficulty[log.difficulty][specNumber].number += 1;
                                }
                            }
                        }
                    });
                }
            });
        }

        // Calc ratio for each difficulty & spec
        var i = 0;
        var bestHighSpecTotal =  {kill: 0, average: 0, median: 0, best: 0, number: 0};
        var bestAllSpecTotal = {kill: 0, average: 0, median: 0, best: 0, number: 0};

        // Calc best spec in highest difficulty & best spec overall
        Object.keys(warcraftLogs.bosses).forEach(function(key, value) {
            var averageSpec = {0: {kill: 0, average: 0, median: 0, best: 0, number: 0}, 1: {kill: 0, average: 0, median: 0,  best: 0, number: 0}, 2: {kill: 0, average: 0, median: 0,  best: 0, number: 0}, 3: {kill: 0, average: 0, median: 0,  best: 0, number: 0}};
            var bestHighSpec = {kill: 0, average: 0, median: 0, best: 0, difficulty: 0};
            for (var difficulty = 3; difficulty <= 5; difficulty++) {
                for (var spec = 0; spec <= 3; spec++) {
                    if (warcraftLogs.bosses[key].difficulty[difficulty] && warcraftLogs.bosses[key].difficulty[difficulty][spec]) {
                        averageSpec[spec].kill += warcraftLogs.bosses[key].difficulty[difficulty][spec].kill;
                        averageSpec[spec].average += warcraftLogs.bosses[key].difficulty[difficulty][spec].average;
                        averageSpec[spec].median += warcraftLogs.bosses[key].difficulty[difficulty][spec].median;
                        averageSpec[spec].best += warcraftLogs.bosses[key].difficulty[difficulty][spec].best;
                        averageSpec[spec].number += 1;

                        if (warcraftLogs.bosses[key].difficulty[difficulty][spec].kill > bestHighSpec.kill || difficulty > bestHighSpec.difficulty) {
                            bestHighSpec = warcraftLogs.bosses[key].difficulty[difficulty][spec];
                            bestHighSpec.difficulty = difficulty;
                        }
                    }
                }
            }

            var bestAllSpec = {kill: 0, average: 0, median: 0, number: 0};
            for (var spec = 0; spec <= 3; spec++) {
                if (averageSpec[spec].kill > bestAllSpec.kill) {
                    if (averageSpec[spec].number > 0) {
                        averageSpec[spec].average = Math.round(averageSpec[spec].average/averageSpec[spec].number);
                        averageSpec[spec].median = Math.round(averageSpec[spec].median/averageSpec[spec].number);
                        averageSpec[spec].best = Math.round(averageSpec[spec].best/averageSpec[spec].number);
                    }
                    bestAllSpec = averageSpec[spec];
                }
            }

            warcraftLogs.bosses[key]['bestAllSpec'] = bestAllSpec;
            warcraftLogs.bosses[key]['bestHighSpec'] = bestHighSpec;

            // Add to total
            bestHighSpecTotal.kill += bestHighSpec.kill;
            bestHighSpecTotal.average += bestHighSpec.average;
            bestHighSpecTotal.median += bestHighSpec.median;
            bestHighSpecTotal.best += bestHighSpec.best;
            bestHighSpecTotal.number += 1;

            bestAllSpecTotal.kill += bestAllSpec.kill;
            bestAllSpecTotal.average += bestAllSpec.average;
            bestAllSpecTotal.median += bestAllSpec.median;
            bestAllSpecTotal.best += bestAllSpec.best;
            bestAllSpecTotal.number += 1;
        });

        self.parseWarcraftLogsAverage(bestAllSpecTotal);
        self.parseWarcraftLogsAverage(bestHighSpecTotal);

        for (var difficulty = 3; difficulty <= 5; difficulty++) {
            for (var spec = 0; spec <= 3; spec++) {
                if (warcraftLogs.difficulty[difficulty] && warcraftLogs.difficulty[difficulty][spec]) {
                    self.parseWarcraftLogsAverage(warcraftLogs.difficulty[difficulty][spec]);
                }
            }
        }

        warcraftLogs['bestAllSpec'] = bestAllSpecTotal;
        warcraftLogs['bestHighSpec'] = bestHighSpecTotal;  
    } else {
        var warcraftLogs = {bosses: {}, difficulty: {3:{},4:{},5:{}}, 'bestHighSpec': {kill: 0, average: 0, median: 0, best: 0, number: 0}, 'bestAllSpec': {kill: 0, average: 0, median: 0, best: 0, number: 0}};
    }

    return warcraftLogs;
}

/**
 * Parse WCL average
 */
module.exports.parseWarcraftLogsAverage = function (data) {
    if (data && data.number && data.number > 0) {
        data.average = Math.round(data.average/data.number);
        data.median = Math.round(data.median/data.number);
        data.best = Math.round(data.best/data.number);
    }
}

/**
 * Parse Character talents
 */
module.exports.parseCharacterTalents = function (character) {
    var talentSelected;

    if (character && character.talents && character.talents.length > 0) {
        character.talents.forEach(function(talent) {
            if (talent.selected) {
                talentSelected = talent;
                talentSelected.slug = character.class+'-';
                if (talent.spec && talent.spec.name) {
                    talentSelected.slug =  talentSelected.slug + talent.spec.name.toLowerCase();
                }
            }
        });

        if (talentSelected) {
            character.talents = [];
            character.talents.push(talentSelected);
        }
    }
}
