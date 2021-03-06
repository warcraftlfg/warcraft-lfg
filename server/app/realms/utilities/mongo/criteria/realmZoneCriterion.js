"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the realmZone criterion to guild criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var paramArray = params.parseQueryParam(query['realm_zone'], 3);
    if (paramArray.length > 0) {

        var realmZones = [];

        paramArray.forEach(function (realmZoneArray) {
            var realmZoneCriterion = {};
            realmZoneCriterion.region = realmZoneArray[0].toLowerCase();
            realmZoneCriterion["bnet.locale"] = realmZoneArray[1];
            realmZoneCriterion["bnet.timezone"] = realmZoneArray[2];
            realmZones.push(realmZoneCriterion);
        });

        if (realmZones.length > 0) {
            if (!criteria["$or"]) {
                criteria["$or"] = realmZones;
            } else {
                criteria["$or"] = criteria["$or"].concat(realmZones);
            }
        }
    }
};