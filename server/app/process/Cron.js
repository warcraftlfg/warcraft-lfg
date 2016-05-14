"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var characterService = process.require("characters/characterService.js");
var guildModel = process.require("guilds/guildModel.js");
var guildService = process.require("guilds/guildService.js");
var realmService = process.require("realms/realmService.js");
var userService = process.require("users/userService.js");


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
                logger.info("Put lfg characterAds in update list");
                characterService.putLfgAdsInUpdateList(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });
            },
            function (callback) {
                logger.info("Put lfg guildAds in update list");
                guildService.putLfgAdsInUpdateList(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });
            },
            function (callback) {
                logger.info("Refresh Wowprogress Guild Ads");
                guildService.refreshWowProgressAds(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });

            },
            function (callback) {
                logger.info("Refresh Wowprogress Character Ads");
                characterService.refreshWowProgressAds(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });

            },
            function (callback) {
                logger.info("Refresh Realm list from bnet");
                realmService.refreshRealms(function (error) {
                    if (error) {
                        logger.error(error.message);
                    }
                    callback();
                });
            },
            function (callback) {
                //Ads Reminder send mail
                logger.info("Send ads reminder emails");

                userService.sendAdsReminderMail(function () {
                    callback();
                });
            }
        ],
        function () {
            logger.info("Cron finished !!");
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