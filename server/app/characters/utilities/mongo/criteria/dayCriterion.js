"use strict";

//Load dependencies
var moment = require('moment-timezone');
var params = process.require("core/utilities/params.js");

/**
 * Add the days criterion in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {
    var paramArray = params.parseQueryParam(query.day, 4);

    if (paramArray.length > 0) {
        var days = [];

        paramArray.forEach(function (params) {

            var day = params[0];
            var start = parseInt(params[1], 10);
            var end = parseInt(params[2], 10);
            var timezone = params[3];
            var zone = moment.tz.zone(timezone);
            if (zone != null && !isNaN(start) && !isNaN(end)) {

                var tmpObj = {};
                tmpObj["ad.play_time." + day + ".play"] = true;
                if (start != 0 || end != 0) {
                    var offset = Math.round(zone.parse(Date.UTC()) / 60);
                    if(end>start){
                        tmpObj["ad.play_time." + day + ".start.hourUTC"] = {"$gte": start + offset};
                        tmpObj["ad.play_time." + day + ".end.hourUTC"] = {"$lte": end + offset};
                    } else {
                        tmpObj["ad.play_time." + day + ".start.hourUTC"] = {"$lte": start + offset};
                        tmpObj["ad.play_time." + day + ".end.hourUTC"] = {"$gte": end + offset};

                    }
                }
                days.push(tmpObj);

            }
        });

        if (days.length > 0) {
            if (!criteria["$and"]) {
                criteria["$and"] = days;
            }
            else {
                criteria["$and"] = criteria["$and"].concat(days);
            }
        }
    }
};