"use strict";

/**
 * Validate userId param
 * @param userId
 * @param callback
 */
module.exports.validate = function (userId, callback) {
    if (userId == null) {
        return callback(new Error('MISSING_USERID_VALIDATION_ERROR'));
    }
    callback();
};

