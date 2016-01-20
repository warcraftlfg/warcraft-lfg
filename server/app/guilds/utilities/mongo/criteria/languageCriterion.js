"use strict";

var params = process.require("core/utilities/params.js");

/**
 *
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){
    var paramArray = params.parseQueryParam(query.language,1);

    if(paramArray.length > 0){
        var languages = [];
        paramArray.forEach(function(param){
            languages.push(param[0]);
        });
        criteria["ad.language"] = {$in: languages};
    }
};