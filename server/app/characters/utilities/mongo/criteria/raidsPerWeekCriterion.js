"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the raids_per_week criterion in character's criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var paramArray = params.parseQueryParam(query.raids_per_week, 2);
    if (paramArray.length > 0) {
        var min = parseInt(paramArray[0][0], 10);
        var max = parseInt(paramArray[0][1], 10);
        if (isNaN(min) || isNaN(max)) {
            return;
        }
        criteria["ad.raids_per_week.min"] = {$lte: min};
        criteria["ad.raids_per_week.max"] = {$gte: max};
    }
};