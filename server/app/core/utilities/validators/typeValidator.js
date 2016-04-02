"use strict";

/**
 * Validate type param
 * @param message
 * @param callback
 */
module.exports.validate = function (type, callback) {
    if (type == null) {
        return callback(new Error('MISSING_TYPE_VALIDATION_ERROR'));
    }
    if (type != "character" && type != "guild") {
        return callback(new Error('WRONG_TYPE_VALIDATION_ERROR'));
    }
    callback();
};

