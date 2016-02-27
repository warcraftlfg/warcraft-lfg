"use strict";

//Load dependencies
var async = require("async");
var moment = require('moment-timezone');
var applicationStorage = process.require("core/applicationStorage.js");
var limitModel = process.require("limits/limitModel.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var guildModel = process.require("guilds/guildModel.js");
var guildService = process.require("guilds/guildService.js");
var bnetAPI = process.require("core/api/bnet.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");

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
            //Check if max request is reach - GuildUpdateProcess take 1 request to Bnet
            limitModel.increment("bnet", function (error, value) {
                if (value > applicationStorage.config.oauth.bnet.limit) {
                    logger.info("Bnet Api limit reach ... waiting 1 min");
                    updateModel.insert("gu", guildUpdate.region, guildUpdate.realm, guildUpdate.name, guildUpdate.priority, function (error) {
                        setTimeout(function () {
                            callback(true);
                        }, 60000);
                    });
                }
                else {
                    callback(error, guildUpdate);
                }
            });
        },
        function (guildUpdate, callback) {
            //Sanitize name
            bnetAPI.getGuild(guildUpdate.region, guildUpdate.realm, guildUpdate.name, ["members"], function (error, guild) {
                if (guild.realm && guild.name) {
                    callback(error, guildUpdate.region, guild, guildUpdate.priority);
                } else {
                    logger.warn("Bnet return empty guild skip it");
                    callback(true);
                }

            })
        },
        function (region, guild, priority, callback) {
            async.parallel([
                function (callback) {
                    //Insert members to update
                    guildService.setMembersToUpdate(region, guild.realm, guild.name, guild.members, priority, function (error) {
                        if (error) {
                            logger.error(error.message);
                        }
                        callback();
                    });
                },
                function (callback) {
                    //Wowprogress kill
                    guildService.updateWowProgressKill(region, guild.realm, guild.name, function (error) {
                        if (error) {
                            logger.error(error.message);
                        }
                        callback();
                    });
                }
            ], function () {
                callback(null, region, guild)
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
                wowProgress: function (callback) {
                    //Wowprogress ranking
                    wowProgressAPI.getGuildRank(region, guild.realm, guild.name, function (error, wowProgress) {
                        if (error) {
                            logger.error(error.message);
                        } else {
                            wowProgress.updated = new Date().getTime();
                        }
                        callback(error, wowProgress);
                    });
                }
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