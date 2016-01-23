"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Validate realm param
 * @param region
 * @param callback
 */
module.exports.validate = function (region, callback) {
    var config = applicationStorage.config;

    //noinspection JSUnresolvedVariable
    if (config.bnetRegions.indexOf(region) == -1) {
        return callback(new Error('WRONG_REGION_VALIDATION_ERROR'));
    }
    if (region == null) {
        return callback(new Error('MISSING_REGION_VALIDATION_ERROR'));
    }
    callback();
};