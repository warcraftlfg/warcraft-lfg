"use strict";

var async = require("async");

/**
 * Add the zone criteria from zone param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    if(!query.zone)
        return;

    var zonesCriteria = [];

    if(Array.isArray(query.zone)) {
        async.each(query.zone, function (zoneString, callback) {
            var zoneCriteria = createZoneCriteria(zoneString);
            if(zoneCriteria)
                zonesCriteria.push(zoneCriteria);
            callback();
        });
    }
    else{
        var zoneCriteria = createZoneCriteria(query.zone);
        if(zoneCriteria)
            zonesCriteria.push(zoneCriteria);
    }

    if (zonesCriteria.length > 0) {
        if(!criteria["$or"])
            criteria["$or"] = zonesCriteria;
        else
            criteria["$or"] = criteria["$or"].concat(zonesCriteria);
    }
};

/**
 * Parse the zone and create zoneCriteria object
 * @param zone
 * @returns {*}
 */
function createZoneCriteria(zone){
    var zoneArray = zone.split("--");

    if(zoneArray.length !=3)
        return null;

    var zoneCriteria = {};
    zoneCriteria.region = zoneArray[0].toLowerCase();
    zoneCriteria["bnet.locale"] = zoneArray[1];
    zoneCriteria["bnet.timezone"] = zoneArray[2];
    return zoneCriteria;
}