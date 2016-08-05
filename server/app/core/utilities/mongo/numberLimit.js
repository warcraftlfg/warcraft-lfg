"use strict";

/**
 * Get the number of documents to return from param (max 10, min 0 & default 5)
 * @param query
 * @returns {number}
 */
module.exports.get = function (query) {

    var number = 5;
    if (query.number) {
        number = parseInt(query.number, 10);

        if (isNaN(number)) {
            return;
        }

        number = number > 20 ? 20 : number;
        number = number < 0 ? 0 : number;
    }
    return number;
};
