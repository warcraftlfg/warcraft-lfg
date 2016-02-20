"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the lfg criteria in characters criterion
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var paramArray = params.parseQueryParam(query.level_max, 1);
    if (paramArray.length > 0) {
        if (paramArray[0][0] === 'true') {
            criteria["bnet.level"] = {$gte: 100};
        }
    }
};