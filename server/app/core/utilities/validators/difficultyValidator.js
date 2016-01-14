"use strict";

/**
 * Validate difficulty param
 * @param difficulty
 * @param callback
 */
module.exports.validate = function (difficulty,callback){
    if(difficulty === null){
        return callback(new Error('MISSING_DIFFICULTY_VALIDATION_ERROR'));
    }
    callback();
};

//Todo check difficulty (mythic / heroic / normal)
