"use strict";

/**
 * Validate bossWeight param
 * @param bossWeight
 * @param callback
 */
module.exports.validate = function (bossWeight,callback){
    if(isNaN(parseInt(bossWeight,10))){
        return callback(new Error('BOSSWEIGHT_NAN_VALIDATION_ERROR'));
    }
    callback();
};