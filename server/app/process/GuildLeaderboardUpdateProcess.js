"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");

/**
 * GuildUpdateProcess constructor
 * @constructor
 */
function GuildLeaderboardUpdateProcess(autoStop) {
    this.autoStop = autoStop;
}

/**
 * Update a guild Leaderboard
 */
GuildLeaderboardUpdateProcess.prototype.updateLeaderboard = function () {
    var self = this;
    var logger = applicationStorage.logger;

    async.waterfall([
        function (callback) {
            guildModel.getFullRanking(function (error, guilds) {
                callback(error, guilds);
            });
        },
        function (guilds, callback) {
            //Do the world rank
            var worldRank = 0;
            var regionRank = {eu: 0, us: 0, tw: 0, kr: 0};

            async.forEachSeries(guilds, function (guild, callback) {
                worldRank++;
                regionRank[guild.region] = regionRank[guild.region] + 1;
                if (guild.region && guild.realm && guild.name) {
                    var obj = {
                        rank: {
                            "Hellfire Citadel": {
                                world: worldRank,
                                region: regionRank[guild.region]
                            }
                        }
                    };
                    logger.info("%s-%s-%s", guild.region, guild.realm, guild.name);
                    guildModel.upsert(guild.region, guild.realm, guild.name, obj, function (error) {
                        if (error) {
                            logger.error(error);
                        }
                        callback();
                    });

                } else {
                    logger.warn("Guild missing component %s-%s-%s", guild.region, guild.realm, guild.name);
                    callback();
                }

            }, function () {
                callback();
            });
        }
    ], function (error) {
        if (error && error !== true) {
            logger.error(error.message);
        }
        if (self.autoStop) {
            process.exit();
        }
    });
};

/**
 * Start GuildLeaderboardUpdateProcess
 * @param callback
 */
GuildLeaderboardUpdateProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting GuildLeaderboardUpdateProcess");
    this.updateLeaderboard();
    callback();
};

module.exports = GuildLeaderboardUpdateProcess;