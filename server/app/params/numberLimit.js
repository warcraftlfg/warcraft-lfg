"use strict";

/**
 * Get the number of documents to return from param (max 10, min 0 & default 5)
 * @param query
 * @returns {number}
 */
module.exports.get = function(query){

    var number = 5;
    if(query.number) {
        number = query.number > 10 ? 10 : query.number;
        number = query.number < 0 ? 0 : number;
    }
    return number;
};
