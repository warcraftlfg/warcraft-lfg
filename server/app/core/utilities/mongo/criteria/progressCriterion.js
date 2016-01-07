"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");
var applicationStorage = process.require("core/applicationStorage.js");
/**
 * Add the lfg criteria from lfg param
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){

    var config = applicationStorage.config;

    var paramArray = params.parseQueryParam(query.progress,2);
    if(paramArray.length > 0)
    {
        var count = parseInt(paramArray[0][1],10);
        if(isNaN(count)){
            return;
        }
        var progressFactor;
        if (paramArray[0][0] == "normal") {
            progressFactor = 1000;
        } else if (paramArray[0][0] == "heroic") {
            progressFactor = 100000;
        } else if (paramArray[0][0] == "mythic") {
            progressFactor = 10000000;
        } else {
            return;
        }

        var raid = config.progress.raids[0];
        criteria["progress."+raid.name+".score"] = {$lt: (count+1)*progressFactor};
    }
};
