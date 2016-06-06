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

    var paramArray = params.parseQueryParam(query.progress, 3);
    if (paramArray.length > 0) {
        var min = parseInt(paramArray[0][1], 10);
        var max  = parseInt(paramArray[0][2], 10);
        if (isNaN(min) || isNaN(max)) {
            return;
        }
        var progressFactor;
        if (paramArray[0][0] == "normal") {
            criteria["progress.score.normalCount"] = {$lte: max,$gte: min};
        } else if (paramArray[0][0] == "heroic") {
            criteria["progress.score.heroicCount"] = {$lte: max,$gte: min};
        } else if (paramArray[0][0] == "mythic") {
            criteria["progress.score.mythicCount"] = {$lte: max,$gte: min};
        } else {
            return;
        }

    }
};
