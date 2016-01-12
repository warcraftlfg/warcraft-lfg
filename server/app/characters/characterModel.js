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
    var collection = applicationStorage.mongo.collection("characters");
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
 * Get one character
 * @param criteria
 * @param projection
 */
module.exports.findOne = function(criteria,projection,callback){
    var collection = applicationStorage.mongo.collection("characters");
    collection.findOne(criteria, projection,function (error, character) {
        callback(error, character);
    });
};

/**
 * Return the number of characters
 * @param criteria
 * @param callback
 */
module.exports.count = function(criteria,callback){
    var collection = applicationStorage.mongo.collection("characters");
    collection.count(criteria,function(error,count){
        callback(error, count);
    });
};