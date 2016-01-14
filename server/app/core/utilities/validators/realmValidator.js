"use strict";

/**
 * Validate region param
 * @param realm
 */
module.exports.validate = function (realm,callback){
    if(realm === null){
        return callback(new Error('MISSING_REALM_VALIDATION_ERROR'));
    }
    callback();
};