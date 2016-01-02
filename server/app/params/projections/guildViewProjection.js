"use strict";

var applicationStorage = process.require("api/applicationStorage.js");

/**
 * Get the projection for guild
 * @param query
 * @param projection
 */
module.exports.add = function(query,projection){
    var config = applicationStorage.config;
    if(query.view === "detailed") {
        projection["bnet.side"]=1;
        projection.ad=1;
        projection.wowProgress=1;

        /** @namespace config.progress.raids */
        config.progress.raids.forEach(function(raid) {
            projection["progress."+raid.name+".normalCount"] = 1;
            projection["progress."+raid.name+".heroicCount"] = 1;
            projection["progress."+raid.name+".mythicCount"] = 1;
        });

    }
    if (query.view === "minimal") {
        projection["bnet.side"] = 1;
        projection["ad.updated"] = 1;
    }
};
