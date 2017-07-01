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
                    callback(error, guildUpdate.region, guildUpdate.priority, guild);
                } else {
                    logger.warn("Bnet return empty guild skip it");
                    callback(true);
                }

            })
        },
        function (region, priority, guild, callback) {
            if (priority > 0) {
                //Set guild to update for progress (change with url call update)
                updateModel.insert('wp_gu', region, guild.realm, guild.name, priority == 5 ? 10 : priority, function (error) {
                    callback(error, region, guild);
                });
            } else {
                callback(null, region, guild);
            }
        },
        function (region, guild, callback) {
            guildModel.findOne({
                region: region,
                realm: guild.realm,
                name: guild.name
            }, {ad: 1, parser: 1}, function (error, guildObj) {
                callback(error, region, guild, guildObj);
            });
        },
        function (region, guild, guildObj, callback) {
            if (guildObj && guildObj.parser.active && guild.members) {
                async.each(guild.members, function (member, callback) {
                    if (guildObj.parser.ranks["rank_" + member.rank]) {
                        if (member.character && member.character.realm && member.character.name) {
                            updateModel.insert('cu', region, member.character.realm, member.character.name, 3, function (error) {
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }, function (error) {
                    callback(error, region, guild, guildObj);
                });

            } else {
                callback(null, region, guild, guildObj);
            }
        },
        function (region, guild, guildObj, callback) {
            async.parallel({
                ad: function (callback) {
                    if (guildObj && guildObj.ad && guildObj.ad.timezone && guildObj.ad.lfg == true) {
                        var offset = Math.round(moment.tz.zone(guildObj.ad.timezone).parse(Date.UTC()) / 60);
                        async.each(guildObj.ad.play_time, function (day, callback) {
                            day.start.hourUTC = day.start.hour + offset;
                            day.end.hourUTC = day.end.hour + offset;
                            callback();
                        }, function () {
                            callback(null, guildObj.ad);
                        });
                    } else {
                        callback();
                    }
                },
                rank: function (callback) {

                    var result = {};
                    var nbResult = 0;
                    async.forEachSeries(config.progress, function (progress, callback) {
                        if (result[progress.tier] == null)
                            result[progress.tier] = {};
                        progressAPI.getRank(progress.tier, progress.raid, region, guild.realm, guild.name, function (error, rank) {
                            if (error) {
                                logger.error(error.message);
                                callback();
                            } else if (rank) {
                                result.updated = new Date().getTime();
                                if (result.world && result.region && result.realm && result.locale) {
                                    result.world = result.world + rank.world;
                                    result.region = result.region + rank.region;
                                    result.realm = result.realm + rank.realm;
                                    result.locale.rank = result.locale.rank + rank.locale.rank;
                                }
                                else {
                                    result.world = rank.world;
                                    result.region = rank.region;
                                    result.realm = rank.realm;
                                    result.locale = rank.locale;
                                }
                                nbResult++;
                                result[progress.tier][progress.raid] = rank;
                                callback();
                            } else {
                                callback();
                            }
                        });
                    }, function () {
                        if (nbResult > 0) {
                            result.world = result.world / nbResult;
                            result.region = result.region / nbResult;
                            result.realm = result.realm / nbResult;
                            result.locale.rank = result.locale.rank / nbResult;
                        }
                        callback(null, result);
                    });

                },
                progress: function (callback) {
                    var result = {};
                    async.forEachSeries(config.progress, function (progress, callback) {
                        if (result[progress.tier] == null)
                            result[progress.tier] = {};
                        progressAPI.getProgress(progress.tier, progress.raid, region, guild.realm, guild.name, function (error, progressResult) {
                            if (error) {
                                logger.error(error.message);
                                callback()
                            } else if (progressResult) {
                                result.updated = new Date().getTime();
                                if (result.normalCount && result.heroicCount && result.mythicCount) {
                                    result.normalCount = result.normalCount + progressResult.normalCount;
                                    result.heroicCount = result.heroicCount + progressResult.heroicCount;
                                    result.mythicCount = result.mythicCount + progressResult.mythicCount;
                                } else {
                                    result.normalCount = progressResult.normalCount;
                                    result.heroicCount = progressResult.heroicCount;
                                    result.mythicCount = progressResult.mythicCount;
                                }
                                result[progress.tier][progress.raid] = progressResult;
                                callback();
                            } else {
                                callback();
                            }
                        });
                    }, function () {
                        callback(null, result);
                    });
                }
            }, function (error, results) {
                if (error) {
                    callback(error);
                } else {
                    results.bnet = guild;
                    results.bnet.updated = new Date().getTime();
                    guildModel.upsert(region, guild.realm, guild.name, results, function (error) {
                        callback(error);
                    });
                }
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