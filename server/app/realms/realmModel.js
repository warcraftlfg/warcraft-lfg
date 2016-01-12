"use strict";

var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get the characters
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param callback
 */
module.exports.find = function(criteria,projection,sort,limit,callback){
    var collection = applicationStorage.mongo.collection("realms");
    if(limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else if(callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, characters) {
            callback(error, characters);
        });
    }
};

/**
 * Get one realm
 * @param criteria
 * @param projection
 */
module.exports.findOne = function(criteria,projection,callback){
    var collection = applicationStorage.mongo.collection("realms");
    collection.findOne(criteria, projection,function (error, guild) {
        callback(error, guild);
    });
};
