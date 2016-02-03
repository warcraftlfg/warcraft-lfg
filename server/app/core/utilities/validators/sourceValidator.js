"use strict";

/**
 * Validate source param
 * @param source
 * @param callback
 */
module.exports.validate = function (source, callback) {
    if (source === null) {
        return callback(new Error('MISSING_SOURCE_VALIDATION_ERROR'));
    }
    callback();
};

//Todo check source (wowprogress or progress)
