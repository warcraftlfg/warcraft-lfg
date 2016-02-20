"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the lfg criterion in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var paramArray = params.parseQueryParam(query.lfg, 1);
    if (paramArray.length > 0) {
        if (paramArray[0][0] === 'true') {
            criteria['ad.lfg'] = true;
        }
        if (paramArray[0][0] === 'false') {
            criteria['ad.lfg'] = false;
        }
    }
};