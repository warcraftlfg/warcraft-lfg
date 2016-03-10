"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");
var bnetAPI = process.require("core/api/bnet.js");
var realmModel = process.require("realms/realmModel.js");
var updateModel = process.require("updates/updateModel.js");


/**
 * CleanerProcess constructor
 * @param autoStop
 * @constructor
 */
function Cron(autoStop) {
    this.autoStop = autoStop;
}

/**
 * Clean Ads
 */
Cron.prototype.cleanAds = function () {
    var logger = applicationStorage.logger;
    var config = applicationStorage.config;
    var self = this;
    async.series([
            function (callback) {
                //Disable lfg for old character ads
                logger.info("Set LFG to false for old character ads");
                characterModel.disableLfgForOldAds(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                })
            },
            function (callback) {
                //Disable lfg for old guild ads
                logger.info("Set LFG to false for old guild ads");
                guildModel.disableLfgForOldAds(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                })
            },
            function (callback) {
                //Set to Update Character Ads
                async.waterfall([
                    function (callback) {
                        characterModel.find({"ad.lfg": true}, {region: 1, realm: 1, name: 1}, function (error, characters) {
                            callback(error, characters);
                        });
                    },
                    function (characters, callback) {
                        async.each(characters, function (character, callback) {
                            updateModel.insert('cu', character.region, character.realm, character.name, 3, function (error) {
                                logger.verbose("Insert character to update %s-%s-%s to update with priority 3", character.region, character.realm, character.name);
                                callback(error);
                            });
                        }, function (error) {
                            callback(error, characters.length);
                        });
                    }
                ], function (error, length) {
                    if (error && error !== true) {
                        logger.error(error.message);
                    } else {
                        logger.info("Added %s characters to update", length)
                    }
                    callback();
                });
            },
            function (callback) {
                //Set to Update Character Ads
                async.waterfall([
                    function (callback) {
                        guildModel.find({"ad.lfg": true}, {region: 1, realm: 1, name: 1}, function (error, guilds) {
                            callback(error, guilds);
                        });
                    },
                    function (guilds, callback) {
                        async.each(guilds, function (guild, callback) {
                            updateModel.insert('cu', guild.region, guild.realm, guild.name, 3, function (error) {
                                logger.verbose("Insert guild to update %s-%s-%s to update with priority 3", guild.region, guild.realm, guild.name);
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
                        logger.info("Added %s guilds to update", length)
                    }
                    callback();
                });
            },
            function (callback) {
                //Refresh all wowprogress guildAds
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
            },
            function (callback) {
                //Refresh all wowprogress characterAds
                async.waterfall([
                    function (callback) {
                        characterModel.find(
                            {
                                "ad.lfg": true, id: {$exists: false}
                            }, {region: 1, realm: 1, name: 1}, {"ad.updated": 1}, function (error, characters) {
                                callback(error, characters);

                            });
                    },
                    function (characters, callback) {
                        async.forEachSeries(characters, function (character, callback) {
                            logger.info("Checking wowprogress Character Ad update %s-%s-%s", character.region, character.realm, character.name);
                            wowProgressAPI.parseCharacter(character.region, character.realm, character.name, function (error, ad) {
                                if (error) {
                                    logger.error(error.message);
                                    callback();
                                }
                                else if (ad && ad.lfg == false) {
                                    logger.info("Set LFG to false for wowprogress Character Ad %s-%s-%s", character.region, character.realm, character.name);
                                    characterModel.upsert(character.region, character.realm, character.name, {"ad": ad}, function (error) {
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
            },
            function (callback) {

                //noinspection JSUnresolvedVariable
                async.each(config.bnetRegions, function (region, callback) {
                    async.waterfall([
                        function (callback) {
                            bnetAPI.getRealms(region, function (error, realms) {
                                callback(error, realms);
                            });
                        },
                        function (realms, callback) {
                            var connectedRealms = [];
                            realms.forEach(function (realm) {
                                var key = realm.connected_realms.join("__");
                                if (!connectedRealms[key]) {
                                    connectedRealms[key] = [realm.name];
                                } else {
                                    connectedRealms[key].push(realm.name);
                                }
                            });
                            callback(null, realms, connectedRealms)
                        },
                        function (realms, connectedRealms, callback) {
                            async.each(realms, function (realm, callback) {
                                var connected_realms = connectedRealms[realm.connected_realms.join("__")];
                                realmModel.upsert(region, realm.name, connected_realms, realm, function (error) {
                                    logger.info("Upsert Realm %s-%s (%s)", region, realm.name, connected_realms);
                                    callback(error);
                                });
                            }, function (error) {
                                callback(error);
                            });
                        }
                    ], function (error) {
                        callback(error);
                    })
                }, function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });
            }
        ],
        function () {
            if (self.autoStop) {
                process.exit();
            }
        }
    );
};

/**
 * Start the Cron
 * @param callback
 */
Cron.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting Cron");
    this.cleanAds();
    callback();

};

module.exports = Cron;