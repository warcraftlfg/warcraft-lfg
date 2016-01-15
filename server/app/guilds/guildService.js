"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");
var guildModel = process.require("guilds/guildModel.js");
var guildKillModel = process.require("guildKills/guildKillModel.js");
var updateModel = process.require("updates/updateModel.js");
var userService = process.require("users/userService.js");

/**
 * Sanitize and set the user's id to the guild
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.sanitizeAndSetId = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            bnetAPI.getGuild(region,realm,name,[],function(error,guild){
                callback(error,guild);
            });
        },
        function(guild,callback){
            guildModel.setId(region,guild.realm,guild.name,id,function(error){
                callback(error,guild);
            });
        }
    ],function(error,guild){
        callback(error,guild);
    });
};

/**
 * Set the members of a guild to update
 * @param region
 * @param realm
 * @param name
 * @param members
 * @param priority
 * @param callback
 */
module.exports.setMembersToUpdate = function(region,realm,name,members,priority,callback){
    var logger = applicationStorage.logger;
    async.each(members,function(member,callback){
        if(member.character.level >= 100 || priority == 0) {
            updateModel.insert("cu",region, member.character.realm, member.character.name, priority <= 5 ? priority : 3, function (error) {
                logger.verbose("Insert character to update %s-%s-%s",region,member.character.realm,member.character.name);
                callback(error);
            });
        } else {
            callback();
        }
    },function(error){
        callback(error);
    });
};

/**
 * Update wowprogress kills for progress
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.updateWowProgressKill = function(region,realm,name,callback){
    var logger = applicationStorage.logger;
    async.waterfall([
        function(callback){
            wowProgressAPI.getGuildProgress(region,realm, name ,function(error, wowProgressRanking) {
                callback(error,wowProgressRanking);
            });
        },
        function(wowProgressRanking,callback){
            async.each(wowProgressRanking,function(progress,callback){
                guildKillModel.upsert(progress.region, progress.realm, progress.name, "Hellfire Citadel", progress.boss,progress.bossWeight, progress.difficulty, progress.timestamp, progress.source, null, function(error) {
                    logger.verbose("Upsert wowprogress kill %s-%s for guild %s-%s-%s",progress.boss,progress.difficulty,region,realm,name);
                    callback(error);
                });
            },function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });

};

/**
 * Update wowprogress ranking
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.updateWowProgressRanking = function(region,realm,name,callback){
    var logger = applicationStorage.logger;
    async.waterfall([
        function(callback){
            wowProgressAPI.getGuildRank(region,realm,name ,function(error, wowProgress) {
                callback(error,wowProgress);
            });
        },
        function(wowProgress,callback) {
            guildModel.upsertWowProgress(region,realm,name,wowProgress,function(error){
                logger.verbose("Upsert wowprogress ranking for guild %s-%s-%s",region,realm,name);
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};
