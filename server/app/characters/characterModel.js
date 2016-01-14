"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterAdSchema = process.require('config/db/characterAdSchema.json');
var validator = process.require('core/utilities/validators/validator.js');
var Confine = require("confine");

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
 * Update or insert ad for the character
 * @param region
 * @param realm
 * @param name
 * @param ad
 * @param callback
 */
module.exports.upsertAd = function(region,realm,name,ad,callback){
    async.series([
        function(callback){
            //Force region to lowercase
            region = region.toLowerCase();
            //Sanitize ad object
            var confine = new Confine();
            ad = confine.normalize(ad,characterAdSchema);
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            ad.updated = new Date().getTime();
            //Upsert
            var collection = applicationStorage.mongo.collection("characters");
            collection.update({region:region,realm:realm,name:name}, {$set:{ad:ad}}, {upsert:true}, function(error,result){
                callback(error,result);
            });
        }
    ],function(error){
        callback(error);
    });
};


/**
 * Update or insert ad for the character
 * @param region
 * @param realm
 * @param name
 * @param ad
 * @param callback
 */
module.exports.deleteAd = function(region,realm,name,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            //Upsert
            var collection = applicationStorage.mongo.collection("characters");
            collection.update({region:region,realm:realm,name:name}, {$unset: {ad:""}}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
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
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name,id:id},function(error){
                callback(error);
            });
        },
        function(callback){
            var collection = applicationStorage.mongo.collection("characters");
            collection.update({region:region,realm:realm,name:name}, {$set:{id:id}}, {upsert:true}, function(error,result){
                callback(error,result);
            });
        }
    ],function(error){
        callback(error);
    });
};


