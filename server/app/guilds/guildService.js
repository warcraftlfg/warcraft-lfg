"use strict";

//Load dependencies
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
module.exports.sanitizeAndSetId = function (region, realm, name, id, callback) {
    async.waterfall([
        function (callback) {
            bnetAPI.getGuild(region, realm, name, [], function (error, guild) {
                callback(error, guild);
            });
        },
        function (guild, callback) {
            guildModel.setId(region, guild.realm, guild.name, id, function (error) {
                callback(error, guild);
            });
        }
    ], function (error, guild) {
        callback(error, guild);
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
module.exports.setMembersToUpdate = function (region, realm, name, members, priority, callback) {
    var logger = applicationStorage.logger;
    async.each(members, function (member, callback) {
        if (member.character.level >= 100 || priority == 0) {
            updateModel.insert("cu", region, member.character.realm, member.character.name, priority <= 5 ? priority : 3, function (error) {
                logger.verbose("Insert character to update %s-%s-%s with priority", region, member.character.realm, member.character.name, priority <= 5 ? priority : 3);
                callback(error);
            });
        } else {
            callback();
        }
    }, function (error) {
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
module.exports.updateWowProgressKill = function (region, realm, name, callback) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            wowProgressAPI.getGuildProgress(region, realm, name, function (error, wowProgressRanking) {
                callback(error, wowProgressRanking);
            });
        },
        function (wowProgressRanking, callback) {
            async.each(wowProgressRanking, function (progress, callback) {
                guildKillModel.upsert(progress.region, progress.realm, progress.name, "Hellfire Citadel", progress.boss, progress.bossWeight, progress.difficulty, progress.timestamp, progress.source, null, function (error) {
                    logger.verbose("Upsert wowprogress kill %s-%s for guild %s-%s-%s", progress.boss, progress.difficulty, region, realm, name);
                    callback(error);
                });
            }, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });

};

/**
 *
 * @param wowProgressGuildAd
 * @param callback
 */
module.exports.insertWoWProgressGuildAd = function (wowProgressGuildAd, callback) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            bnetAPI.getGuild(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, [], function (error, guild) {
                callback(error, guild);
            });
        },
        function (guild, callback) {
            //Force name with bnet response (case or russian realm name)
            wowProgressGuildAd.realm = guild.realm;
            wowProgressGuildAd.name = guild.name;
            guildModel.findOne({
                region: wowProgressGuildAd.region,
                realm: wowProgressGuildAd.realm,
                name: wowProgressGuildAd.name
            }, {ad: 1}, function (error, guild) {
                callback(error, guild);
            });
        },
        function (guild, callback) {
            if (!guild || (guild && !guild.ad) || (guild && guild.ad && !guild.ad.updated)) {
                async.parallel([
                    function (callback) {
                        wowProgressGuildAd.updated = new Date().getTime();
                        guildModel.upsert(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, {ad:wowProgressGuildAd}, function (error) {
                            callback(error);
                        });
                    },
                    function (callback) {
                        updateModel.insert('gu', wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, 10, function (error) {
                            if (!error) {
                                logger.info("Insert guild to update %s-%s-%s with priority 10", wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name);
                            }
                            callback(error);
                        });
                    }
                ], function (error) {
                    callback(error)
                });
            } else {
                callback();
            }
        }
    ], function (error) {
        callback(error);
    });
};
