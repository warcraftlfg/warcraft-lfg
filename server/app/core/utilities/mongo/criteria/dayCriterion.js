"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the days criterion in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {
    var paramArray = params.parseQueryParam(query.day, 1);

    if (paramArray.length > 0) {
        var days = [];
        paramArray.forEach(function (param) {
            var tmpObj = {};
            tmpObj["ad.play_time." + param[0] + ".play"] = true;
            days.push(tmpObj);
        });

        if (days.length > 0) {
            if (!criteria["$and"]) {
                criteria["$and"] = [{"$or": days}];
            }
            else {
                criteria["$and"] = criteria["$and"].concat({"$or": days});
            }
        }
    }
};