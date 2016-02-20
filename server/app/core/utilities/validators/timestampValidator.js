"use strict";

/**
 * Validate timestamp param
 * @param timestamp
 * @param callback
 */
module.exports.validate = function (timestamp, callback) {
    if (timestamp === null) {
        return callback(new Error('MISSING_TIMESTAMP_VALIDATION_ERROR'));
    }
    callback();
};

//Todo check if is a timestamp
