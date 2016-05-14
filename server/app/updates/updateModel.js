"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage");

/**
 * Insert an update into list
 * @param type
 * @param region
 * @param realm
 * @param name
 * @param priority
 * @param callback
 */
module.exports.insert = function (type, region, realm, name, priority, callback) {
    var config = applicationStorage.config;
    var redis = applicationStorage.redis;
    //Check for required attributes
    if (type == null) {
        return callback(new Error('Field type is required in updateModel'));
    }
    if (region == null) {
        return callback(new Error('Field region is required in updateModel'));
    }
    if (realm == null) {
        return callback(new Error('Field realm is required in updateModel'));
    }
    if (name == null) {
        return callback(new Error('Field name is required in updateModel'));
    }
    if (priority == null) {
        return callback(new Error('Field priority is required in updateModel'));
    }
    if (config.priorities.indexOf(priority) == -1) {
        return callback(new Error('Priority param is not set in config file'));
    }


    //Force region to lower case
    region = region.toLowerCase();

    //Create object to insert
    var value = JSON.stringify({region: region, realm: realm, name: name, priority: priority});

    //Create or update auctionUpdate
    redis.lpush(type + "_" + priority, value, function (error) {
        callback(error);
    });
};

/**
 * Return the next update in list with a priority
 * @param type
 * @param priority
 * @param callback
 */
module.exports.getUpdate = function (type, priority, callback) {
    var redis = applicationStorage.redis;
    async.waterfall([
        function (callback) {
            //Get last value of the list
            redis.rpop(type + "_" + priority, function (error, value) {
                callback(error, value)
            });
        },
        function (value, callback) {
            //Remove all similar value in the list
            if (value === null) { return callback(null, value); }
            redis.lrem(type + "_" + priority, 0, value, function (error) {
                callback(error, value)
            });
        }
    ], function (error, value) {
        callback(error, JSON.parse(value));
    });
};

/**
 * Return the number of updates in list
 * @param type
 * @param priority
 * @param callback
 */
module.exports.getCount = function (type, priority, callback) {
    var redis = applicationStorage.redis;
    redis.llen(type + "_" + priority, function (error, value) {
        callback(error, value);
    });
};

