"use strict";

/**
 * Validate type param
 * @param realm
 * @param callback
 */
module.exports.validate = function (type, callback) {
    if (type == null) {
        return callback(new Error('MISSING_TYPE_VALIDATION_ERROR'));
    }
    if(type!= "guild" && type!="character"){
        return callback(new Error('WRONG_TYPE_VALIDATION_ERROR'));
    }
    callback();
};