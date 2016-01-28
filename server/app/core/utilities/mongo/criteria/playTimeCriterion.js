"use strict";

//Load dependencies
var async = require("async");
var params = process.require("core/utilities/params.js");

/**
 * Add the playTime in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {
    var paramsArray = params.parseQueryParam(query.play_time, 3);
    async.each(paramsArray, function (params, callback) {
        var day = params[0];
        var start = params[1];
        var end = params[2];
        criteria["ad.play_time."+day+".start"] = {"$gte": start};
        criteria["ad.play_time."+day+".end"] = {"$gte": end};
        callback();
    });
};