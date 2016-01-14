"use strict";

var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Validate realm param
 * @param realm
 */
module.exports.validate = function (region,callback){
    var config = applicationStorage.config;

    if(config.bnetRegions.indexOf(region)==-1){
        return callback(new Error('WRONG_REGION_VALIDATION_ERROR'));
    }
    if(region == null){
        return callback(new Error('MISSING_REGION_VALIDATION_ERROR'));
    }
    callback();
};