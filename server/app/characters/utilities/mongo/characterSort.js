"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Return the sort from query for characters
 * @param query
 * @returns {{}}
 */
module.exports.get = function (query) {
    var sort = {};

    if (query.sort == "ilevel") {
        sort["bnet.items.averageItemLevelEquipped"] = -1;
    } else if (query.sort == "progress") {
        sort["progress.score"] = -1;
    } else {
        sort["ad.updated"] = -1;
    }
    sort._id = -1;

    return sort;
};