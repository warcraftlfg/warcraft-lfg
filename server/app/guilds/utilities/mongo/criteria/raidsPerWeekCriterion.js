"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the criterion for raids per week
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    var paramArray = params.parseQueryParam(query.raids_per_week,2);
    if(paramArray.length > 0)
    {
        var min = parseInt(paramArray[0][0],10);
        var max = parseInt(paramArray[0][1],10);
        if (isNaN(min) ||isNaN (max))
            return;
        criteria["ad.raids_per_week.min"] = {$gte:min};
        criteria["ad.raids_per_week.max"] = {$lte:max};
    }
};