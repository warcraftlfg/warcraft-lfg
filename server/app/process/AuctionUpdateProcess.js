"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var guildModel = process.require("guilds/guildModel.js");
var bnetAPI = process.require("core/api/bnet.js");

/**
 * AuctionUpdateProcess constructor
 * @constructor
 */
function AuctionUpdateProcess() {
}

/**
 * Update an auction
 */
AuctionUpdateProcess.prototype.updateAuction = function () {
    var logger = applicationStorage.logger;
    var self = this;
    async.waterfall([
        function (callback) {
            //Get next guild to update
            updateService.getNextUpdate('au', function (error, auctionUpdate) {
                if (auctionUpdate == null) {
                    //Guild update is empty
                    logger.info("No auction to update ... waiting 3 sec");
                    setTimeout(function () {
                        callback(true);
                    }, 3000);
                } else {
                    logger.info("Update with auction owner %s-%s-%s", auctionUpdate.region, auctionUpdate.realm, auctionUpdate.name);
                    callback(error, auctionUpdate);
                }
            });
        },
        function (auctionUpdate, callback) {
            //Sanitize name
            bnetAPI.getCharacter(auctionUpdate.region, auctionUpdate.realm, auctionUpdate.name, ["guild"], function (error, character) {
                if (error) {
                    if (error.statusCode == 403) {
                        logger.info("Bnet Api Deny ... waiting 1 min");
                        updateModel.insert("au", auctionUpdate.region, auctionUpdate.realm, auctionUpdate.name, auctionUpdate.priority, function () {
                            setTimeout(function () {
                                callback(true);
                            }, 60000);
                        });
                    } else {
                        callback(error);
                    }
                } else {
                    if (character.guild) {
                        callback(null, auctionUpdate.region, character);
                    } else {
                        callback(true);
                    }
                }
            })
        },
        function (region, character, callback) {
            //Get Guild
            guildModel.findOne({region: region, realm: character.guild.realm, name: character.guild.name}, {
                region: 1,
                realm: 1,
                name: 1,
                "bnet.updated": 1
            }, function (error, guild) {
                if (error) {
                    return callback(error);
                }
                var timestampWeekAgo = new Date().getTime() - (7 * 24 * 3600 * 1000);
                if (guild == null || guild.bnet == null || guild.bnet.updated < timestampWeekAgo) {
                    callback(error, region, character.guild.realm, character.guild.name);
                } else {
                    callback(true);
                }
            });
        },
        function (region, realm, name, callback) {
            updateModel.insert("gu", region, realm, name, 0, function (error) {
                logger.info("Insert guild %s-%s-%s to update ", region, realm, name);
                callback(error);
            });
        }

    ], function (error) {
        if (error && error !== true) {
            logger.error(error.message);
        }
        self.updateAuction();
    });
};

/**
 * Feeds the auction when guildUpdate & characterUpdate & auctionUpdate are empty
 */
AuctionUpdateProcess.prototype.feedAuctions = function () {
    var logger = applicationStorage.logger;
    var self = this;
    async.series([
        function (callback) {
            //Look if characterUpdates, guildUpdates & auctionUpdates are empty
            async.parallel({
                characterUpdatesCount: function (callback) {
                    updateModel.getCount("cu", 0, function (error, count) {
                        callback(error, count);
                    });
                },
                guildUpdatesCount: function (callback) {
                    updateModel.getCount("gu", 0, function (error, count) {
                        callback(error, count);
                    });
                },
                auctionUpdatesCount: function (callback) {
                    updateModel.getCount("au", 0, function (error, count) {
                        callback(error, count);
                    });
                }
            }, function (error, results) {
                if (error) {
                    return callback(error);
                }
                if (results.characterUpdatesCount === 0 && results.guildUpdatesCount === 0 && results.auctionUpdatesCount === 0) {
                    callback();
                } else {
                    logger.info("Cannot Feed Auctions CharacterUpdate, guildUpdate & auctionUpdate are not empty. Waiting 3 sec");
                    setTimeout(function () {
                        callback(true);
                    }, 3000);
                }
            });
        },
        function (callback) {
            self.importAuctionOwners(function (error) {
                callback(error);
            });
        }
    ], function (error) {
        if (error && error !== true) {
            logger.error(error.message);
        }
        self.feedAuctions();
    });
};

AuctionUpdateProcess.prototype.importAuctionOwners = function (callback) {
    var logger = applicationStorage.logger;
    var self = this;
    async.waterfall([
        function (callback) {
            updateService.getNextUpdate('aru', function (error, auctionRealmUpdate) {
                callback(error, auctionRealmUpdate);
            });
        },
        function (auctionRealmUpdate, callback) {
            if (auctionRealmUpdate) {
                bnetAPI.getAuctions(auctionRealmUpdate.region, auctionRealmUpdate.name, function (error, auctions) {
                    callback(error, auctionRealmUpdate.region, auctions);
                });
            } else {
                logger.info("No AuctionRealmUpdate found ... import them ");
                self.importAuctionRealms(function () {
                    callback(true);
                });
            }
        },
        function (region, auctions, callback) {
            async.each(auctions, function (auction, callback) {
                updateModel.insert("au", region, auction.ownerRealm, auction.owner, 0, function (error) {
                    logger.info("Insert auction owner %s-%s-%s to update ", region, auction.ownerRealm, auction.owner);
                    callback(error);
                });

            }, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });

};

/**
 * Import auctions owner to update
 * @param callback
 */
AuctionUpdateProcess.prototype.importAuctionRealms = function (callback) {
    var logger = applicationStorage.logger;
    var config = applicationStorage.config;
    async.each(config.bnetRegions, function (region, callback) {
        async.waterfall([
            function (callback) {
                bnetAPI.getRealms(region, function (error, realms) {
                    callback(error, realms);
                });
            },
            function (realms, callback) {
                async.eachSeries(realms, function (realm, callback) {
                    updateModel.insert("aru", region, "", realm.connected_realms[0], 0, function (error) {
                        logger.verbose("Insert auction realm %s-%s to update", region, realm.connected_realms[0]);
                        callback(error);
                    });
                }, function (error) {
                    callback(error);
                });
            }
        ], function (error) {
            callback(error);
        });
    }, function (error) {
        callback(error);
    });
};

/**
 * Start AuctionUpdateProcess
 * @param callback
 */
AuctionUpdateProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting AuctionUpdateProcess");
    this.updateAuction();
    this.feedAuctions();
    callback();
};
s
module.exports = AuctionUpdateProcess;