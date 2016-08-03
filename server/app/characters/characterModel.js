"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var characterAdSchema = process.require('config/db/characterAdSchema.json');
var validator = process.require('core/utilities/validators/validator.js');
var Confine = require("confine");

/**
 * Get the characters objects
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param skip
 * @param callback
 */
module.exports.find = function (criteria, projection, sort, limit, skip, callback) {
    var collection = applicationStorage.mongo.collection("characters");
    if (skip === undefined && limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else if (skip === undefined && callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else if (callback == undefined) {
        callback = skip;
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).skip(skip).toArray(function (error, characters) {
            callback(error, characters);
        });
    }
};


/**
 * Get one character object
 * @param criteria
 * @param projection
 * @param callback
 */
module.exports.findOne = function (criteria, projection, callback) {
    var collection = applicationStorage.mongo.collection("characters");
    collection.findOne(criteria, projection, function (error, character) {

        //Sanitize before return
        if (character) {
            var confine = new Confine();
            character.ad = confine.normalize(character.ad, characterAdSchema);
        }

        callback(error, character);
    });
};

/**
 * Return the number of characters
 * @param criteria
 * @param callback
 */
module.exports.count = function (criteria, callback) {
    var collection = applicationStorage.mongo.collection("characters");
    collection.count(criteria, function (error, count) {
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
module.exports.upsert = function (region, realm, name, obj, callback) {


    async.series([
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var character = {};
            if(obj.ad){
                var confine = new Confine();
                character.ad = confine.normalize(obj.ad, characterAdSchema);
            }

            if(obj.bnet){
                character.bnet = obj.bnet;
            }

            if(obj.warcraftLogs){
                character.warcraftLogs = obj.warcraftLogs;
            }

            if(obj.progress){
                character.progress = obj.progress;
            }

            //Force region to lowercase
            region = region.toLowerCase();

            character.region = region;
            character.realm = realm;
            character.name = name;
            character.updated = new Date().getTime();

            //Upsert
            var collection = applicationStorage.mongo.collection("characters");
            collection.updateOne({
                region: region,
                realm: realm,
                name: name
            }, {$set: character}, {upsert: true}, function (error, result) {
                callback(error, result);
            });
        }
    ], function (error) {
        callback(error);
    });
};





/**
 * Delete ad for the character
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.deleteAd = function (region, realm, name, callback) {
    async.series([
        function (callback) {
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            //Upsert
            var collection = applicationStorage.mongo.collection("characters");
            collection.updateOne({region: region, realm: realm, name: name}, {$unset: {ad: ""}}, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};


/**
 * Set lfg to false for ads of 1 month old
 * @param callback
 */
module.exports.disableLfgForOldAds = function (callback) {
    var timestamp = new Date().getTime() - (30 * 24 * 3600 * 1000);
    var collection = applicationStorage.mongo.collection("characters");
    collection.updateMany({
        "ad.updated": {$lte: timestamp},
        "ad.lfg": true
    }, {$set: {"ad.lfg": false}}, function (error) {
        callback(error);
    });
};


/**
 * Set ID on character object
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.setId = function (region, realm, name, id, callback) {
    async.series([
        function (callback) {
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name, id: id}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var collection = applicationStorage.mongo.collection("characters");
            collection.updateOne({
                region: region,
                realm: realm,
                name: name
            }, {$set: {id: id}}, {upsert: true}, function (error, result) {
                callback(error, result);
            });
        }
    ], function (error) {
        callback(error);
    });
};


