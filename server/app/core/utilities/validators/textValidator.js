"use strict";

/**
 * Validate message param
 * @param text
 * @param callback
 */
module.exports.validate = function (text, callback) {
    if (text == null) {
        return callback(new Error('MISSING_MESSAGE_VALIDATION_ERROR'));
    }
    if (text.length > 400) {
        return callback(new Error('TOO_LONG_MESSAGE_VALIDATION_ERROR'));
    }
    callback();
};

