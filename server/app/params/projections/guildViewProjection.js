"use strict";

var async = require("async");

/**
 * Get the projection for guild
 * @param query
 */
module.exports.add = function(query,projection){
    if(query.view === "detailed") {
        projection["bnet.side"]=1;
        projection.ad=1;
        projection.wowProgress=1;
    }
    if (query.view === "minimal") {
        projection["bnet.side"] = 1;
        projection["ad.updated"] = 1;
    }
};
