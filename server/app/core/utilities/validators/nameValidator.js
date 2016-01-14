"use strict";

/**
 * Validate name param
 * @param realm
 */
module.exports.validate = function (name,callback){
    if(name === null){
        return callback(new Error('MISSING_NAME_VALIDATION_ERROR'));
    }
    callback();
};