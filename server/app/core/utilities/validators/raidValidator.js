"use strict";

/**
 * Validate raid param
 * @param raid
 * @param callback
 */
module.exports.validate = function (raid, callback) {
    if (raid === null) {
        return callback(new Error('MISSING_RAID_VALIDATION_ERROR'));
    }
    callback();
    //TODO Check if raid is in config file
};