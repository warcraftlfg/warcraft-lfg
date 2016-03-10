"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get the projection for guild
 * @param query
 */
module.exports.get = function (query) {
    var config = applicationStorage.config;
    var projection = {region: 1, realm: 1, name: 1};
    if (query.view === "detailed") {
        projection["bnet.side"] = 1;
        projection["ad.language"] = 1;
        projection["ad.recruitment"] = 1;
        projection["ad.raids_per_week"] = 1;
        projection["ad.updated"] = 1;
        projection["progress.score"] = 1;
        projection.wowProgress = 1;
    }
    if (query.view === "minimal") {
        projection["bnet.side"] = 1;
        projection["ad.updated"] = 1;
    }
    return projection;
};
