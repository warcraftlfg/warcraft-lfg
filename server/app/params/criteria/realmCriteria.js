"use strict";

/**
 * Add the realm criteria from realm param or from realmZonesParams
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    //TODO if realmZoneCriteria is set and realm not set send realms into criteria
    var realms = [];
    if(query.realm!=undefined && query.realm !== "") {
        try {
            var realm = JSON.parse(query.realm);
            if(realm.region!=undefined && realm.name !=undefined)
                realms=[{region:realm.region,realm:realm.name}];
        }
        catch (e){
        }
    }

    if (realms.length > 0) {
        if(!criteria["$or"])
            criteria["$or"] = realms;
        else
            criteria["$or"] = criteria["$or"].concat(realms);
    }
};