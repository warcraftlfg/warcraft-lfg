"use strict";

var numberLimit = process.require("core/utilities/mongo/numberLimit.js");

/**
 * Get the number of document to skip.
 * @param query
 * @returns {number}
 */
module.exports.get = function (query) {

    var number = numberLimit.get(query)

    if (query.page) {
        var page = parseInt(query.page, 10);

        if (isNaN(page)) {
            return 0;
        } else {
            if (page > 0) {
                return page * number
            }else{
                return 0;
            }
        }
    } else {
        return 0;
    }
};
