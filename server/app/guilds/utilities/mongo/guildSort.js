"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");
var params = process.require("core/utilities/params.js");


/**
 * Get the sort to guild
 * @param query
 * @returns {{}}
 */
module.exports.get = function (query) {
    var sort = {};

    var paramLastArray = params.parseQueryParam(query.last, 3);
    var type = "";
    if (paramLastArray.length > 0) {
        type = paramLastArray[0][0];
    }

    if (query.sort == "ranking") {
    	if (type == "max") {
    		sort["rank.world"] = -1;
    	} else {
        	sort["rank.world"] = 1;
        }
    } else {
    	if (type == "max") {
    		sort["ad.updated"] = 1;
    	} else {
        	sort["ad.updated"] = -1;
        }
    }
    if (type == "max") {
    	sort._id = 1;
    } else {
    	sort._id = -1;
    }

    return sort;

};