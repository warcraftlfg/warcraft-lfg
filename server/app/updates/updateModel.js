"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("api/applicationStorage");

var config = applicationStorage.config;
var redis = applicationStorage.redis;

/**
 * Insert or update an update into list
 * @param type
 * @param region
 * @param realm
 * @param name
 * @param priority
 * @param callback
 */
module.exports.upsert = function(type,region,realm,name,priority,callback){

    //Check for required attributes
    if(type == null)
        return callback(new Error('Field type is required in updateModel'));
    if(region == null)
        return callback(new Error('Field region is required in updateModel'));
    if(realm == null)
        return callback(new Error('Field realm is required in updateModel'));
    if(name == null)
        return callback(new Error('Field name is required in updateModel'));
    if(priority == null)
        return callback(new Error('Field priority is required in updateModel'));

    //Force region to lower case
    region = region.toLowerCase();

    //Create object to insert
    var value = JSON.stringify({region:region,realm:realm,name:name,priority:priority});

    //Create or update auctionUpdate
    redis.lpush(type+"_"+priority,value,function(error){
        callback(error);
    });
};

/**
 * Return the next update in list with a priority
 * @param type
 * @param priority
 * @param callback
 */
module.exports.getUpdate = function(type,priority,callback) {
    async.waterfall([
        function (callback) {
            //Get last value of the list
            redis.rpop(type + "_" + priority, function (error, value) {
                callback(error, value)
            });
        },
        function (value, callback) {
            //Remove all similar value in the list
            redis.lrem(type + "_" + priority, 0, value, function (error) {
                callback(error, value)
            });
        }
    ], function (error,value) {
        callback(error,JSON.parse(value));
    });
};

/**
 * Return the next update in list with higher priority
 * @param type
 * @param callback
 */
module.exports.getNextUpdate = function(type,callback){
    var self = this;
    /** @namespace config.priorities */
    async.eachSeries(config.priorities,function(priority,callback){
        self.getUpdate(type, priority, function (error, result) {
            if(error)
                return callback(error);
            if(result)
                return callback({result:result});
            else
                callback()
        });
    },function(result){
        if(!result)
            return callback();
        if(result.error)
            return callback(result.error);
        callback(null,result.result);
    });
};

/**
 * Return the number of updates in list
 * @param type
 * @param priority
 * @param callback
 */
module.exports.getCount = function (type,priority,callback) {
    redis.llen(type+"_"+priority,function(error,value){
        callback(error,value);
    });
};

