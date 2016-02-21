"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");
var wowProgressAPI = process.require("core/api/wowProgress.js");

/**
 * CleanerProcess constructor
 * @param autoStop
 * @constructor
 */
function CleanerProcess(autoStop) {
    this.autoStop = autoStop;
}

/**
 * Clean Ads
 */
CleanerProcess.prototype.cleanAds = function () {
    var logger = applicationStorage.logger;
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
                //Refresh all wowprogress guildAds
                async.waterfall([
                    function (callback) {
                        guildModel.find(
                            {
                                "ad.lfg": true, id: {$exists:false}
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
                                "ad.lfg": true, id: {$exists:false}
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
            }
        ],
        function () {
            if (self.autoStop) {
                process.exit();
            }
        }
    )
    ;

}
;

/**
 * Start the CleanerProcess
 * @param callback
 */
CleanerProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting CleanerProcess");
    this.cleanAds();
    callback();

};

module.exports = CleanerProcess;