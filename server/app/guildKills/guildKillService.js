"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildKillModel = process.require("guildKills/guildKillModel.js");
var updateModel = process.require("updates/updateModel.js");
var characterModel = process.require("characters/characterModel.js");

/**
 * Upsert character kills in guildKill and insert pveScore
 * @param talents
 * @param progression
 */
module.exports.updateProgress = function(region,character,callback){

    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
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
            },function(){
                var progress = {};
                progress.pveScore = pveScore;
                progress[raid.name] = { 'score': pveScore };
                characterModel.upsertProgress(region, character.realm, character.name, progress, function (error) {
                    callback(error);
                });
            });

        },function(error){
            callback(error);
        });
    },function(error){
        callback(error);
    });

};