"use strict";

var async = require("async");
var realmZonesCriteria = process.require("params/criteria/realmZonesCriteria.js");
var realmService = process.require("realms/realmService.js");
var applicationStorage = process.require("api/applicationStorage.js");

/**
 * Add the realm criteria from realm param or from realmZonesParams
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria,callback){

    var logger = applicationStorage.logger;

    var realmList= [];

    async.series([
        function(callback){
            var realmCriteria = {};
            realmZonesCriteria.add(query,realmCriteria);
            if(realmCriteria['$or']!=undefined){
                realmService.find(realmCriteria,function(error,realms){
                    if (error)
                        logger.error(error.message);
                    else {
                        async.forEach(realms,function(realm,callback){
                            realmList.push({region:realm.region,realm:realm.name});
                            callback();

                        },function(){
                            callback();
                        })

                    }
                });
            }
        },
        function(callback){
            if(query.realm!=undefined && query.realm !== "") {
                try {
                    var realm = JSON.parse(query.realm);
                    if(realm.region!=undefined && realm.name !=undefined)
                        realmList=[{region:realm.region,realm:realm.name}];
                }
                catch (e){
                }
                callback();
            }

        }
    ],function(){

        if (realmList.length > 0) {
            if(!criteria["$or"])
                criteria["$or"] = realmList;
            else
                criteria["$or"] = criteria["$or"].concat(realmList);
        }
        callback();
    });
};