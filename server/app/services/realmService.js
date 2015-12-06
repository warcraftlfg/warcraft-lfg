"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var realmModel = process.require("models/realmModel.js");
var async = require("async");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");


module.exports.importRealms = function(callback){
    config.bnet_regions.forEach(function(region) {
        bnetAPI.getRealms(region,function(error,realms) {
            if (error) {
                logger.error(error.message);
                return callback();
            }
            async.eachSeries(realms.realms,function(realm,callback){
                realmModel.insertOrUpdateBnet(region, realm.name, realm,function(error){
                    if(error)
                        return callback(error);
                    logger.info("Insert Realm " + region + "-" + realm.connected_realms[0]);
                    callback();
                });
            },function(error){
                if(error)
                    logger.error(error.message);
                callback();
            });
        })
    });

};

module.exports.getRealms = function(region,callback){
    realmModel.get(region,function(error,realms){
        callback(error,realms);
    });
};
