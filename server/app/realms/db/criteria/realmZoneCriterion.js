"use strict";

var utils = process.require("core/utils.js");

/**
 * Add the realmZone criteria from zone param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria) {

    var paramArray = utils.parseQueryParam(query['realm_zone'], 3);
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
            if (!criteria["$or"])
                criteria["$or"] = realmZones;
            else
                criteria["$or"] = criteria["$or"].concat(realmZones);
        }
    }
};