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
            async.waterfall([
                function(callback){
                    var connectedRealms=[];
                    async.eachSeries(realms.realms,function(realm,callback){
                        var key = realm.connected_realms.join("__");
                        if(!connectedRealms[key])
                            connectedRealms[key] = [realm.name];
                        else
                            connectedRealms[key].push(realm.name);
                        callback();
                    },function(error){
                        callback(error,connectedRealms)
                    });

                },function(connectedRealms,callback){
                    async.eachSeries(realms.realms,function(realm,callback){
                        var connected_realms = connectedRealms[realm.connected_realms.join("__")];
                        realmModel.insertOrUpdateBnet(region, realm.name,connected_realms, realm,function(error){
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
                }
            ],function(error){
                callback(error);
            });
        })
    });

};

module.exports.getFromRealmZones = function(realmZones,callback){
    realmModel.getFromRealmZones(realmZones,function(error,realms){
        callback(error,realms);
    });
};

module.exports.get = function(region,name,callback){

    realmModel.get(region,name,function(error,realm){
        callback(error,realm);
    });
};



