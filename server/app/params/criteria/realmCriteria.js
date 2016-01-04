"use strict";

var async = require("async");
var realmZonesCriteria = process.require("params/criteria/realmZonesCriteria.js");
var realmModel = process.require("realms/realmModel.js");

/**
 * Add the realm criteria from realm param or from realmZonesParams
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria,callback){
    async.series({
        realmListFromRealmZoneParam : function(callback){
            getRealmsFromRealmZonesParam(query,function(error,realmList){
                callback(error,realmList);
            });
        },
        realmListFromRealmParam: function(callback){
            getRealmsFromRealmParam(query,function(error,realmList){
                callback(error,realmList);
            });
        }
    },function(error,results){
        var realmList;
        if(results.realmListFromRealmParam.length > 0)
            realmList = results.realmListFromRealmParam;
        else if(results.realmListFromRealmZoneParam.length > 0)
            realmList = results.realmListFromRealmZoneParam;

        if (realmList) {
            if(!criteria["$or"])
                criteria["$or"] = realmList;
            else
                criteria["$or"] = criteria["$or"].concat(realmList);
        }
        callback(error);
    });
};

function getRealmsFromRealmZonesParam(query,callback){
    var realmList= [];
    async.waterfall([
        function(callback){
            var realmCriteria = {};
            realmZonesCriteria.add(query,realmCriteria);
            if(realmCriteria['$or']!=undefined){
                realmModel.find(realmCriteria,{name:1,region:1,"_id":0}).sort({name:1,region:1}).exec(function(error,realms){
                    callback(error,realms)
                });
            }
            else
                callback(null,null);
        },
        function(realms,callback){
            if(realms) {
                realms.forEach(function (realm, callback) {
                    realmList.push({region: realm.region, realm: realm.name});
                });
            }
            callback(null,realmList);
        }
    ],function(error,realmList){
        callback(error,realmList);
    });
}

function getRealmsFromRealmParam(query,callback){
    var realmList = [];
    async.waterfall([
        function(callback){
            try {
                var realm = JSON.parse(query.realm);
                if(realm.region!=undefined && realm.name !=undefined)
                    realmModel.findOne({region:realm.region,name:realm.name},{region:1,connected_realms:1,"_id":0},function(error,realm){
                        callback(error,realm);
                    });
                else {
                    callback(null,null);
                }
            }
            catch (error){
                callback(null,null);
            }
        },
        function(realm,callback){
            if(realm) {
                realm.connected_realms.forEach(function (name) {
                    realmList.push({realm: name, region: realm.region});
                });
            }
            callback(null,realmList);
        }
    ],function(error,realmList){
        callback(error,realmList);
    });

}
