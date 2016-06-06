"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get the sort to guild
 * @param query
 * @returns {{}}
 */
module.exports.get = function (query) {
    var sort = {};
    if (query.sort == "ranking") {
        sort["progress.rank.world"] = 1;
    } else {
        sort["ad.updated"] = -1;
    }
    sort._id = -1;
    return sort;

};