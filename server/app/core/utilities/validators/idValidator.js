"use strict";

/**
 * Validate id param
 * @param id
 * @param callback
 */
module.exports.validate = function (id,callback){
    if(isNaN(parseInt(id,10))){
        return callback(new Error('ID_NAN_VALIDATION_ERROR'));
    }
    callback();
};