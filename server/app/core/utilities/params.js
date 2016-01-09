"use strict";

/**
 * Return an array with ParamArray if number is ok
 * @param param
 * @param number
 * @returns {Array}
 */
module.exports.parseQueryParam = function(param,number){

    var result = [];

    if (param == null) {
        return result;
    }

    if(Array.isArray(param)) {
        //Param is an array
        param.forEach(function(paramString){
            if(paramString!="") {
                var paramArray = paramString.split('.');
                if (paramArray.length == number)
                    result.push(paramArray);
            }
        });

    }
    else {
        //Param is a string
        if(param!="") {
            var paramArray = param.split('.');
            if (paramArray.length == number)
                result.push(paramArray);
        }
    }

    return result;

};
