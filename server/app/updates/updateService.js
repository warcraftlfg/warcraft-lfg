"use strict";

//Load module dependencies
var applicationStorage = process.require("api/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");

var logger = applicationStorage.logger;

/**
 * Insert update at the end of the list
 * @param type
 * @param region
 * @param realm
 * @param name
 * @param priority
 * @param callback
 */
module.exports.upsert = function(type,region,realm,name,priority,callback){
    updateModel.upsert(type, region, realm, name,priority,function(error){
        logger.verbose("Set guild %s-%s-%s to update with priority %s",region,realm,name,priority);
        callback(error);
    });
};