"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var realmModel = process.require("realms/realmModel.js");
function RealmUpdateProcess(){
    this.lock = false;
}

RealmUpdateProcess.prototype.importRealms = function() {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    config.bnetRegions.forEach(function(region) {
        async.waterfall([
            function(callback){
                bnetAPI.getRealms(region,function(error,realms) {
                    callback(error,realms);
                });
            },
            function(realms,callback){
                var connectedRealms=[];
                realms.forEach(function(realm){
                    var key = realm.connected_realms.join("__");
                    if(!connectedRealms[key])
                        connectedRealms[key] = [realm.name];
                    else
                        connectedRealms[key].push(realm.name);
                });
                callback(null,realms,connectedRealms)
            },
            function(realms,connectedRealms,callback){
                async.each(realms,function(realm,callback){
                    var connected_realms = connectedRealms[realm.connected_realms.join("__")];
                    realmModel.upsert(region, realm.name,connected_realms, realm,function(error){
                        logger.info("Insert Realm %s-%s (%s)",region,realm.name,realm.connected_realms[0]);
                        callback(error);
                    });
                },function(error){
                    callback(error);
                });
            }
        ])
    },function(error){
        if (error && error !==true)
            logger.error(error.message);
    });



};

RealmUpdateProcess.prototype.start = function(){
    applicationStorage.logger.info("Starting RealmUpdateProcess");
    this.importRealms();

};

module.exports = RealmUpdateProcess;