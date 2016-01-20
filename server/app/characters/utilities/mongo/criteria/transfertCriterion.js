"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the lfg criteria from lfg param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    var paramArray = params.parseQueryParam(query.transfert,1);
    if(paramArray.length > 0)
    {
        if(paramArray[0][0]==='true')
            criteria['ad.transfert'] = true;
        if(paramArray[0][0]==='false')
            criteria['ad.transfert'] = false;
    }
};