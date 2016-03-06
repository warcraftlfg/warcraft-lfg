"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the rank criterion in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var paramArray = params.parseQueryParam(query.rank, 1);
    if (paramArray.length > 0) {
        if (paramArray[0][0] === 'true') {
            criteria['rank.Hellfire Citadel.world'] = {"$exists":true};
        }
    }
};