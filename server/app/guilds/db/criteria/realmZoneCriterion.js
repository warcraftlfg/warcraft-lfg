"use strict";

var async = require("async");

/**
 * Add the realmZones criteria from zone param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    if(!query.realmZones)
        return;

    var realmZonesCriteria = [];

    if(Array.isArray(query.realmZones)) {
        async.each(query.realmZones, function (realmZoneString, callback) {
            try {
                var realmZone = JSON.parse(realmZoneString);
                createRealmZoneCriteria(realmZone,realmZonesCriteria);

                callback();
            }
            catch (e){
                callback();
            }

        });
    }
    else{
        try {
            var realmZone = JSON.parse(query.realmZones);
            createRealmZoneCriteria(realmZone,realmZonesCriteria);
        }
        catch (e){
        }
    }

    if (realmZonesCriteria.length > 0) {
        if(!criteria["$or"])
            criteria["$or"] = realmZonesCriteria;
        else
            criteria["$or"] = criteria["$or"].concat(realmZonesCriteria);
    }
};

/**
 * Parse the realmZone and create realmZoneCriteria object
 * @param realmZone
 * @returns {*}
 */
function createRealmZoneCriteria(realmZone,realmZonesCriteria){

    if(
        realmZone.region!=undefined
        && realmZone.locale!=undefined
        && realmZone.zone!=undefined
        && realmZone.cities!=undefined
        && realmZone.cities.length>0){
        async.forEach(realmZone.cities, function (city, callback) {
            var realmZoneCriteria = {};
            realmZoneCriteria.region = realmZone.region.toLowerCase();
            realmZoneCriteria["bnet.locale"] = realmZone.locale;
            realmZoneCriteria["bnet.timezone"] = realmZone.zone + "/" + city;
            realmZonesCriteria.push(realmZoneCriteria);
        });
    }
}