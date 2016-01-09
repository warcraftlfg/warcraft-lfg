"use strict";

var applicationStorage = process.require("core/applicationStorage.js");

/**
 *
 * @param query
 * @returns {{}}
 */
module.exports.get = function(query) {

    var config = applicationStorage.config;
    var raid = config.progress.raids[0];

    var sort = {};

    if (query.sort =="ilevel"){
        sort["bnet.items.averageItemLevelEquipped"] = -1;
    } else if (query.sort =="progress"){
        sort["progress."+raid.name+".score"] = -1;
    }
    else {
        sort["ad.updated"] = -1;
    }
    sort._id=-1;

    return sort;

};