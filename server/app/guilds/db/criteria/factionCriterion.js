"use strict";

//Load dependencies
var utils = process.require("core/utils.js");

/**
 * Add the faction criteria from faction param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    var paramArray = utils.parseQueryParam(query.faction,1);

    if(paramArray.length > 0){
        if(paramArray[0][0] == 0)
            criteria["bnet.side"] = 0;
        if(paramArray[0][0] == 1)
            criteria["bnet.side"] = 1;
    }

};