"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");

/**
 * Return the next update in list with higher priority
 * @param type
 * @param callback
 */
module.exports.getNextUpdate = function (type, callback) {
    var config = applicationStorage.config;

    /** @namespace config.priorities */
    async.eachSeries(config.priorities, function (priority, callback) {
        updateModel.getUpdate(type, priority, function (error, result) {
            if (error) {
                return callback(error);
            }
            if (result) {
                return callback({result: result});
            } else {
                callback()
            }
        });
    }, function (result) {
        if (!result) {
            return callback();
        }
        if (result.error) {
            return callback(result.error);
        }
        callback(null, result.result);
    });
};