"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var userService = process.require("users/userService.js");
var updateModel = process.require("updates/updateModel.js");
var guildKillModel = process.require("guildKills/guildKillModel.js");
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
 * Upsert character kills in guildKill and insert pveScore
 * @param region
 * @param character
 * @param callback
 */
module.exports.getProgress = function(region,character,callback){

    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var progress = null;

    //Loop on talents
    async.forEachSeries(character.talents,function(talent,callback) {
        if(!talent.selected || !talent.spec || talent.spec.name == null || talent.spec.role == null) {
            return callback();
        }

        //Raid progression with kill
        async.forEachSeries(character.progression.raids,function(raid,callback) {
            //Parse only raid in config
            var raidConfig = null;
            config.progress.raids.forEach(function(obj){
                if (obj.name == raid.name) {
                    raidConfig = obj;
                }
            });

            if (raidConfig == null) {
                return callback();
            }

            //Raid progression from character progress bnet
            var bossWeight = 0;
            var pveScore = 0;
            async.forEachSeries(raid.bosses,function(boss,callback){
                if (boss.lfrKills > 0) { pveScore += 10; }
                if (boss.normalKills > 0) { pveScore += 1000; }
                if (boss.heroicKills > 0) { pveScore += 100000; }
                if (boss.mythicKills > 0) { pveScore += 10000000; }

                var difficulties = ["normal","heroic","mythic"];
                if (character.guild && character.guild.name && character.guild.realm) {
                    async.forEachSeries(difficulties, function(difficulty, callback) {
                        if(boss[difficulty+'Timestamp'] == 0) {
                            return callback();
                        }

                        async.series([
                            function(callback){
                                var progress = {name:character.name, realm:character.realm, region:region,spec:talent.spec.name,role:talent.spec.role,level:character.level,faction:character.faction,class:character.class,averageItemLevelEquipped:character.items.averageItemLevelEquipped};
                                guildKillModel.upsert(region,character.guild.realm,character.guild.name,raid.name,boss.name,bossWeight,difficulty,boss[difficulty+'Timestamp'],"progress",progress,function(error) {
                                    logger.verbose('Insert Kill %s-%s-%s for %s-%s-%s ',raid.name,difficulty,boss.name,region,character.guild.realm,character.guild.name);
                                    callback(error);
                                });
                            },
                            function(callback){
                                updateModel.insert("gpu",region, character.guild.realm, character.guild.name, 0, function (error) {
                                    callback(error);
                                });
                            }
                        ],function(error){
                            callback(error);
                        });

                    },function(error){
                        bossWeight++;
                        callback(error);
                    });
                } else {
                    callback();
                }
            },function(error){
                progress = {};
                progress[raid.name] = { 'score': pveScore };
                callback(error)
            });

        },function(error){
            callback(error);
        });
    },function(error){
        callback(error,progress);
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