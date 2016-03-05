"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");

/**
 * UpdateFiller constructor
 * @param autoStop
 * @constructor
 */
function UpdateFiller(autoStop) {
    this.autoStop = autoStop;
}

/**
 * Set updates in redis
 */
UpdateFiller.prototype.setUpdates = function () {
    var logger = applicationStorage.logger;
    var config = applicationStorage.config;
    var self = this;
    async.series([
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
            //Set All guild with a progress to update
            async.eachSeries(config.progress.raids, function (raid, callback) {
                async.waterfall([
                    function (callback) {
                        guildModel.getRankedGuilds(raid.name, function (error, guilds) {
                            callback(error, guilds);
                        });
                    }, function (guilds,callback) {
                        async.each(guilds, function (guild, callback) {
                            updateModel.insert('gu', guild.region, guild.realm, guild.name, 3, function (error) {
                                logger.verbose("Insert guild %s-%s-%s to update with priority 3", guild.region, guild.realm, guild.name);
                                callback(error);
                            });
                        }, function (error) {
                            if (error) {
                                logger.error(error.message);
                            }
                            logger.info("Added %s guilds to update", guilds.length);
                            callback();
                        });
                    }
                ], function () {
                    callback();
                });
            }, function () {
                callback();
            });
        }
    ], function () {
        if (self.autoStop) {
            process.exit();
        }
    })
};


/**
 * Start the updater
 * @param callback
 */
UpdateFiller.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting UpdateFiller");
    this.setUpdates();
    callback();
};

module.exports = UpdateFiller;
