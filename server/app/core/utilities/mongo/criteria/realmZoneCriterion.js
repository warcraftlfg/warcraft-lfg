"use strict";

var async = require("async");
var realmModel = process.require("realms/realmModel.js");
var params = process.require("core/utilities/params.js");

/**
 * Add the realmZones criteria from zone param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria,callback) {
    var paramArray = params.parseQueryParam(query['realm_zone'], 3);


    if (paramArray.length > 0) {
        var realmZones = {};
        realmZones["$or"] = [];
        paramArray.forEach(function (realmZoneArray) {
            var realmZoneCriterion = {};
            realmZoneCriterion.region = realmZoneArray[0].toLowerCase();
            realmZoneCriterion["bnet.locale"] = realmZoneArray[1];
            realmZoneCriterion["bnet.timezone"] = realmZoneArray[2];
            realmZones["$or"].push(realmZoneCriterion);
        });
        realmModel.find(realmZones,{region:1,name:1,_id:0},function(error,realms){
            var realmsCriterion = [];
            realms.forEach(function(realm){
                realmsCriterion.push({region:realm.region,realm:realm.name});
            });

            if (realmsCriterion.length > 0) {
                if (!criteria["$and"]) {
                    criteria["$and"] = [{"$or":realmsCriterion}];
                }
                else {
                    criteria["$and"] = criteria["$and"].concat({"$or":realmsCriterion});
                }
            }
            callback(error);
        });


    }
    else
        callback();
};