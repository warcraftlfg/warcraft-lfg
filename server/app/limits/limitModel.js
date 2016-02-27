"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage");

/**
 * Increment limit
 * @param type
 * @param callback
 */
module.exports.increment = function (type, callback) {
    var redis = applicationStorage.redis;

    var value = "limit_"+type;

    //Increment limit
    redis.incr(value, function (error,value) {
        callback(error,value);
    });
};

/**
 * Return the next update in list with a priority
 * @param type
 * @param callback
 */
module.exports.delete = function (type, callback) {
    var redis = applicationStorage.redis;

    var value = "limit_"+type;

    //Delete limit
    redis.del(value, function (error) {
        callback(error)
    });
};