"use strict";


/**
 * Add the lfg criteria from lfg param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){
    if(query.lfg!=undefined && query.lfg === 'true')
        criteria['ad.lfg'] = true;
};