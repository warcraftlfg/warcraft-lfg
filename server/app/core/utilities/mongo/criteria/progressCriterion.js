"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Add the progression criterion in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {

    var config = applicationStorage.config;

    var paramArray = params.parseQueryParam(query.progress, 3);
    if (paramArray.length > 0) {
        var min = parseInt(paramArray[0][1], 10);
        var max  = parseInt(paramArray[0][2], 10);
        if (isNaN(min) || isNaN(max)) {
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
        criteria["progress." + raid.name + ".score"] = {$lte: (max+1) * progressFactor,$gte: min * progressFactor};
    }
};
