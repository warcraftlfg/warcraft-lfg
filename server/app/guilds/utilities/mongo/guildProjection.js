"use strict";

var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get the projection for guild
 * @param query
 */
module.exports.get = function(query){
    var config = applicationStorage.config;
    var projection = {region:1,realm:1,name:1};
    if(query.view === "detailed") {
        projection["bnet.side"]=1;
        projection["ad.language"]=1;
        projection["ad.recruitment"]=1;
        projection["ad.updated"]=1;

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
    return projection;
};
