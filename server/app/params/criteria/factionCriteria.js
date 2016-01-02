"use strict";

/**
 * Add the faction criteria from faction param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    if(query.faction!=undefined && query.faction !== "") {

        if (query.faction === 0)
            criteria["bnet.side"] = 0;

        if (query.faction === 1)
            criteria["bnet.side"] = 1;
    }
};