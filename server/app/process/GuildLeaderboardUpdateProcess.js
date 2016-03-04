"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");

/**
 * GuildUpdateProcess constructor
 * @constructor
 */
function GuildLeaderboardUpdateProcess() {
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
            var rank = 0;
            async.forEachSeries(guilds, function (guild, callback) {
                rank++;
                if (guild.region && guild.realm && guild.name) {
                    var obj = {progress: {"Hellfire Citadel": {worldRank: rank}}};

                    /*guildModel.upsert(guild.region, guild.realm, guild.name, obj, function (error) {
                        if (error) {
                            logger.error(error);
                        }
                        callback();
                    });*/
                    logger.info("%s-%s-%s", guild.region, guild.realm, guild.name);
                    callback();

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
        //self.updateLeaderboard();
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