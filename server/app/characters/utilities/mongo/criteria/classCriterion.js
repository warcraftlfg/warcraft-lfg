"use strict";

//Load dependencies
var params = process.require("core/utilities/params.js");

/**
 * Add the bnet.class criterion in character's criteria
 * @param query
 * @param criteria
 */
module.exports.add = function (query, criteria) {
    var paramArray = params.parseQueryParam(query.class, 1);

    if (paramArray.length > 0) {
        var classes = [];
        paramArray.forEach(function (param) {
            var classId = parseInt(param[0], 10);
            if (!isNaN(classId)) {
                classes.push(classId);
            }
        });
        criteria["bnet.class"] = {$in: classes};
    }
};