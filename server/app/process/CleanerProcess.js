"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");

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
    async.parallel([
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
            //Refresh all wowprogress ads

            callback();
        }
    ], function () {
        if (self.autoStop) {
            process.exit();
        }
    });

};

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