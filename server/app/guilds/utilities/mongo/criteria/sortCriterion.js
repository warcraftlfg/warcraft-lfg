"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the language criterion to guild criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {
    if (query.sort == "ranking") {
        criteria["rank"] = {$exists:true};
    }
};