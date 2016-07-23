"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get the projection for guild
 * @param query
 */
module.exports.get = function (query) {
    var projection = {region: 1, realm: 1, name: 1};
    if (query.view === "detailed") {
        projection["bnet.side"] = 1;
        projection["ad.language"] = 1;
        projection["ad.recruitment"] = 1;
        projection["ad.raids_per_week"] = 1;
        projection["ad.updated"] = 1;
        projection["progress.tier_18.normalCount"] = 1;
        projection["progress.tier_18.heroicCount"] = 1;
        projection["progress.tier_18.mythicCount"] = 1;
        projection.rank = 1;
        projection["id"] = 1;
    }
    if (query.view === "minimal") {
        projection["bnet.side"] = 1;
        projection["ad.updated"] = 1;
        projection["id"] = 1;
    }
    return projection;
};
