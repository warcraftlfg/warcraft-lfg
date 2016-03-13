"use strict";

/**
 * Validate message param
 * @param message
 * @param callback
 */
module.exports.validate = function (message, callback) {
    if (message == null) {
        return callback(new Error('MISSING_MESSAGE_VALIDATION_ERROR'));
    }
    if (message.length > 400) {
        return callback(new Error('TOO_LONG_MESSAGE_VALIDATION_ERROR'));
    }
    callback();
};

