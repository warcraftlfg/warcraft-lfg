"use strict";

//Load dependencies
var utils = process.require("core/utils.js");

/**
 * Add the lfg criteria from lfg param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    var paramArray = utils.parseQueryParam(query.lfg,1);
    if(paramArray.length > 0)
    {
        if(paramArray[0][0]==='true')
            criteria['ad.lfg'] = true;
        if(paramArray[0][0]==='false')
            criteria['ad.lfg'] = false;
    }
};