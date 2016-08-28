"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get the projection from query for characters
 * @param query
 */
module.exports.get = function (query) {

    var config = applicationStorage.config;
    var projection = {region: 1, realm: 1, name: 1};

    if (query.view === "detailed") {
        projection["ad.raids_per_week"] = 1;
        projection["ad.languages"] = 1;
        projection["ad.role"] = 1;
        projection["ad.updated"] = 1;

        projection["bnet.level"] = 1;
        projection["bnet.class"] = 1;
        projection["bnet.items.averageItemLevelEquipped"] = 1;
        projection["bnet.items.finger1"] = 1;
        projection["bnet.items.finger2"] = 1;
        projection["bnet.faction"] = 1;
        projection["bnet.guild.name"] = 1;
        projection["bnet.progression.raids"] = {$slice: [config.currentCharacterProgress,1]};
        projection["warcraftLogs.bestHighSpec"] = 1;
        projection["warcraftLogs.difficulty"] = 1;
        projection["progress.score"] = 1;
        projection["id"] = 1;

    }

    if (query.view === "minimal") {
        projection["bnet.faction"] = 1;
        projection["ad.updated"] = 1;
        projection["bnet.class"] = 1;
        projection["id"] = 1;
    }
    return projection;
};
