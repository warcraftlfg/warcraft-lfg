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

/**
 * AddtoSet ID
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.setId = function(region,realm,name,id,callback){

    var config = applicationStorage.config;

    //Force region to lowercase
    region = region.toLowerCase();

    if(config.bnetRegions.indexOf(region)==-1){
        return callback(new Error('Region '+ region +' is not allowed in characterModel'));
    }
    if(region == null){
        return callback(new Error('Field region is required in characterModel'));
    }
    if(realm == null){
        return callback(new Error('Field realm is required in characterModel'));
    }
    if(name == null){
        return callback(new Error('Field name is required in characterModel'));
    }
    if(isNaN(parseInt(id,10))){
        return callback(new Error('Id need to be a number'));
    }

    var collection = applicationStorage.mongo.collection("characters");
    collection.update({region:region,realm:realm,name:name}, {$set:{id:id}}, {upsert:true}, function(error,result){
        callback(error,result);
    });

};


