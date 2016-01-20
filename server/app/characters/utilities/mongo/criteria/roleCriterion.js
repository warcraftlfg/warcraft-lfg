"use strict";

var params = process.require("core/utilities/params.js");

/**
 *
 * @param query
 * @param criteria
 */
module.exports.add = function(query,criteria){
    var paramArray = params.parseQueryParam(query.role,1);

    if(paramArray.length > 0){
        var roles = [];
        paramArray.forEach(function(param){
            var tmpObj = {};
            tmpObj["ad.role."+param[0]] = true;
            roles.push(tmpObj);
        });
        if(roles.length>0) {
            if (!criteria["$and"]) {
                criteria["$and"] = [{"$or":roles}];
            }
            else {
                criteria["$and"] = criteria["$and"].concat({"$or":roles});
            }
        }
    }
};