"use strict";

var params = process.require("core/utilities/params.js");

/**
 *
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){
    var paramArray = params.parseQueryParam(query.ilevel,2);

    if(paramArray.length > 0){
        var min = parseInt(paramArray[0][0],10);
        var max = parseInt(paramArray[0][1],10);
        if (isNaN(min) ||isNaN (max))
            return;
        criteria["bnet.items.averageItemLevelEquipped"] = {$lte:max, $gte:min};
    }
};