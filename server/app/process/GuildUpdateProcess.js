"use strict";

//Load dependencies
var async = require("async");
var moment = require('moment-timezone');
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var guildModel = process.require("guilds/guildModel.js");
var guildService = process.require("guilds/guildService.js");
var bnetAPI = process.require("core/api/bnet.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");
var progressAPI = process.require("core/api/progress.js");

/**
 * GuildUpdateProcess constructor
 * @constructor
 */
function GuildUpdateProcess() {
}

/**
 * Update a guild
 */
GuildUpdateProcess.prototype.updateGuild = function () {
    var self = this;
    var logger = applicationStorage.logger;
    var config = applicationStorage.config;


    async.waterfall([
        function (callback) {
            //Get next guild to update
            updateService.getNextUpdate('gu', function (error, guildUpdate) {
                if (guildUpdate == null) {
                    //Guild update is empty
                    logger.info("No guild to update ... waiting 3 sec");
                    setTimeout(function () {
                        callback(true);
                    }, 3000);
                } else {
                    logger.info("Update guild %s-%s-%s", guildUpdate.region, guildUpdate.realm, guildUpdate.name);
                    callback(error, guildUpdate);
                }
            });
        },
        function (guildUpdate, callback) {
            //Sanitize name
            bnetAPI.getGuild(guildUpdate.region, guildUpdate.realm, guildUpdate.name, ["members"], function (error, guild) {
                if (guild && guild.realm && guild.name) {
                    callback(error, guildUpdate.region, guild);
                } else {
                    logger.warn("Bnet return empty guild skip it");
                    callback(true);
                }

            })
        },
        function(region,guild,callback){
            //Set guild to update for progress
            updateModel.insert('wp_gu', region, guild.realm, guild.name, 5, function (error) {
                callback(error,region,guild);
            });
        },
        function (region, guild, callback) {
            async.parallel({
                ad: function (callback) {
                    async.waterfall([
                        function (callback) {
                            guildModel.findOne({
                                region: region,
                                realm: guild.realm,
                                name: guild.name
                            }, {ad: 1}, function (error, guild) {
                                callback(error, guild);
                            });
                        },
                        function (guild, callback) {
                            if (guild && guild.ad && guild.ad.timezone && guild.ad.lfg == true) {
                                var offset = Math.round(moment.tz.zone(guild.ad.timezone).parse(Date.UTC()) / 60);
                                async.each(guild.ad.play_time, function (day, callback) {
                                    day.start.hourUTC = day.start.hour + offset;
                                    day.end.hourUTC = day.end.hour + offset;
                                    callback();
                                }, function () {
                                    callback(null, guild.ad);
                                });
                            } else {
                                callback();
                            }
                        }
                    ], function (error, ad) {
                        if (error) {
                            logger.error(error.message);
                        }
                        callback(null, ad)
                    });
                },
                rank: function (callback) {
                    progressAPI.getRank(config.currentProgress, region, guild.realm, guild.name, function (error, rank) {
                        if (error) {
                            logger.error(error.message);
                        } else if (rank) {
                            rank.updated = new Date().getTime();
                        }
                        callback(null, rank);
                    });
                },
            }, function (error, results) {
                results.bnet = guild;
                results.bnet.updated = new Date().getTime();
                guildModel.upsert(region, guild.realm, guild.name, results, function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });
            })
        }
    ], function (error) {
        if (error && error !== true) {
            logger.error(error.message);
        }
        self.updateGuild();
    });
};

/**
 * Start GuildUpdateProcess
 * @param callback
 */
GuildUpdateProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting GuildUpdateProcess");
    this.updateGuild();
    callback();
};

module.exports = GuildUpdateProcess;