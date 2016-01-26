"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the playTime in criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {
    var paramArray = params.parseQueryParam(query.play_time, 2);

    if (paramArray.length > 0) {

        var start = paramArray[0][0];
        var end = paramArray[0][1];

        criteria["ad.play_time.monday.start"] = {"$gte": start};
        criteria["ad.play_time.monday.end"] = {"$gte": end};
        criteria["ad.play_time.tuesday.start"] = {"$gte": start};
        criteria["ad.play_time.tuesday.end"] = {"$gte": end};
        criteria["ad.play_time.wednesday.start"] = {"$gte": start};
        criteria["ad.play_time.wednesday.end"] = {"$gte": end};
        criteria["ad.play_time.thursday.start"] = {"$gte": start};
        criteria["ad.play_time.thursday.end"] = {"$gte": end};
        criteria["ad.play_time.friday.start"] = {"$gte": start};
        criteria["ad.play_time.friday.end"] = {"$gte": end};
        criteria["ad.play_time.saturday.start"] = {"$gte": start};
        criteria["ad.play_time.saturday.end"] = {"$gte": end};
        criteria["ad.play_time.sunday.start"] = {"$gte": start};
        criteria["ad.play_time.sunday.end"] = {"$gte": end};
    }
};