"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var guildModel = process.require("guilds/guildModel.js");
var guildKillModel = process.require("guildKills/guildKillModel.js");

/**
 * GuildProgressUpdateProcess constructor
 * @constructor
 */
function GuildProgressUpdateProcess() {
}

/**
 * Update Guild progress
 */
GuildProgressUpdateProcess.prototype.updateGuildProgress = function () {
    var logger = applicationStorage.logger;
    var config = applicationStorage.config;
    var self = this;
    async.waterfall([
        function (callback) {
            //Get next guild to update
            updateService.getNextUpdate('gpu', function (error, guildProgress) {
                if (guildProgress == null) {
                    //Guild update is empty
                    logger.info("No guild progress to update ... waiting 3 sec");
                    setTimeout(function () {
                        callback(true);
                    }, 3000);
                } else {
                    logger.info("Update guild process %s-%s-%s", guildProgress.region, guildProgress.realm, guildProgress.name);
                    callback(error, guildProgress);
                }
            });
        },
        function (guildProgress, callback) {
            async.eachSeries(config.progress.raids, function (raid, callback) {
                async.waterfall([
                    function (callback) {
                        guildKillModel.computeProgress(guildProgress.region, guildProgress.realm, guildProgress.name, raid.name, function (error, result) {
                            callback(error, result);
                        });
                    },
                    function (result, callback) {
                        var progress = {};
                        progress.score = 0;
                        async.forEachSeries(result, function (obj, callback) {
                            if (obj.value && obj.value.timestamps && obj.value.timestamps.length > 0) {

                                logger.verbose("Kills found for %s-%s (%s)", obj._id.boss, obj._id.difficulty, obj.value.timestamps.join(','))

                                if (!progress[obj._id.difficulty]) {
                                    progress[obj._id.difficulty] = {};
                                }
                                progress[obj._id.difficulty][obj._id.boss] = obj.value;

                                if (!progress[obj._id.difficulty + "Count"]) {
                                    progress[obj._id.difficulty + "Count"] = 0;
                                }

                                if (obj.value.timestamps.length > 0) {
                                    progress[obj._id.difficulty + "Count"]++;
                                    if (obj._id.difficulty == "normal") {
                                        progress.score += 1000;
                                    } else if (obj._id.difficulty == "heroic") {
                                        progress.score += 100000;
                                    } else {
                                        progress.score += 10000000;
                                    }
                                }
                            }
                            callback();
                        }, function () {
                            guildModel.upsertProgress(guildProgress.region, guildProgress.realm, guildProgress.name, raid.name, progress, function (error) {
                                callback(error);
                            });
                        });
                    }
                ], function (error) {
                    callback(error);
                })
            }, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        if (error && error !== true) {
            logger.error(error.message);
        }
        self.updateGuildProgress();
    });
};

/**
 * Start GuildProgressUpdateProcess
 * @param callback
 */
GuildProgressUpdateProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting GuildProgressUpdateProcess");
    this.updateGuildProgress();
    callback();

};

module.exports = GuildProgressUpdateProcess;