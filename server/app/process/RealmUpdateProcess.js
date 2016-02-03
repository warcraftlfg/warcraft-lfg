"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var realmModel = process.require("realms/realmModel.js");

/**
 * RealmUpdateProcess constructor
 * @param autoStop
 * @constructor
 */
function RealmUpdateProcess(autoStop) {
    this.autoStop = autoStop;
}

/**
 * Imports realms into database
 */
RealmUpdateProcess.prototype.importRealms = function () {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var self = this;
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
                        logger.info("Insert Realm %s-%s (%s)", region, realm.name, connected_realms);
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
        if (self.autoStop) {
            process.exit();
        }

    });
};


/**
 * Start RealmUpdateProcess
 * @param callback
 */
RealmUpdateProcess.prototype.start = function (callback) {
    applicationStorage.logger.info("Starting RealmUpdateProcess");
    this.importRealms();
    callback();
};

module.exports = RealmUpdateProcess;