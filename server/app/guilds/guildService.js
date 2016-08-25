"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var updateModel = process.require("updates/updateModel.js");
var userService = process.require("users/userService.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");
var bnetAPI = process.require("core/api/bnet.js");

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
                        guildModel.upsert(wowProgressGuildAd.region, wowProgressGuildAd.realm, wowProgressGuildAd.name, {ad: wowProgressGuildAd}, function (error) {
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


module.exports.putLfgAdsInUpdateList = function (callback) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            guildModel.find({"ad.lfg": true}, {region: 1, realm: 1, name: 1}, function (error, guilds) {
                callback(error, guilds);
            });
        },
        function (guilds, callback) {
            async.each(guilds, function (guild, callback) {
                updateModel.insert('gu', guild.region, guild.realm, guild.name, 3, function (error) {
                    logger.verbose("Insert guild to update (lfg) %s-%s-%s to update with priority 3", guild.region, guild.realm, guild.name);
                    callback(error);
                });
            }, function (error) {
                callback(error, guilds.length);
            });
        }
    ], function (error, length) {
        if (error && error !== true) {
            logger.error(error.message);
        } else {
            logger.info("Added %s guilds to update (lfg)", length)
        }
        callback();
    });
};


module.exports.putParserInUpdateList = function (callback) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            guildModel.find({"parser.active": true}, {region: 1, realm: 1, name: 1}, function (error, guilds) {
                callback(error, guilds);
            });
        },
        function (guilds, callback) {
            async.each(guilds, function (guild, callback) {
                updateModel.insert('gu', guild.region, guild.realm, guild.name, 3, function (error) {
                    logger.verbose("Insert guild to update (parser) %s-%s-%s to update with priority 3", guild.region, guild.realm, guild.name);
                    callback(error);
                });
            }, function (error) {
                callback(error, guilds.length);
            });
        }
    ], function (error, length) {
        if (error && error !== true) {
            logger.error(error.message);
        } else {
            logger.info("Added %s guilds to update (parser)", length)
        }
        callback();
    });
};


/**
 * Refresh wowProgressAds
 * @param callback
 */
module.exports.refreshWowProgressAds = function (callback) {
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            guildModel.find(
                {
                    "ad.lfg": true, id: {$exists: false}
                }, {region: 1, realm: 1, name: 1}, {"ad.updated": 1}, function (error, guilds) {
                    callback(error, guilds);
                });
        },
        function (guilds, callback) {
            async.forEachSeries(guilds, function (guild, callback) {
                logger.info("Checking for wowprogress Guild Ad update %s-%s-%s", guild.region, guild.realm, guild.name);

                wowProgressAPI.parseGuild(guild.region, guild.realm, guild.name, function (error, ad) {
                    if (error) {
                        logger.error(error.message);
                        callback();
                    }
                    else if (ad && ad.lfg == false) {
                        logger.info("Set LFG to false for wowprogress Guild Ad %s-%s-%s", guild.region, guild.realm, guild.name);
                        guildModel.upsert(guild.region, guild.realm, guild.name, {"ad": ad}, function (error) {
                            if (error) {
                                logger.error(error.message);
                            }
                            callback();
                        });
                    }
                    else {
                        callback();
                    }
                });
            }, function () {
                callback();
            });
        }
    ], function (error) {
        if (error) {
            logger.error(error.message);
        }
        callback();
    });
};
