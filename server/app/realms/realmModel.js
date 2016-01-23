"use strict";

//Load dependencies
var async = require('async');
var applicationStorage = process.require("core/applicationStorage.js");
var validator = process.require("core/utilities/validators/validator.js");

/**
 * Get the characters
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param callback
 */
module.exports.find = function (criteria, projection, sort, limit, callback) {
    var collection = applicationStorage.mongo.collection("realms");
    if (limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else if (callback == undefined) {
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
module.exports.findOne = function (criteria, projection, callback) {
    var collection = applicationStorage.mongo.collection("realms");
    collection.findOne(criteria, projection, function (error, guild) {
        callback(error, guild);
    });
};

/**
 *
 * @param region
 * @param realm
 * @param name
 * @param ad
 * @param callback
 */
module.exports.upsert = function (region, name, connected_realms, bnet, callback) {
    async.series([
        function (callback) {
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function (callback) {
            //Validate Params
            validator.validate({region: region, name: name}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var realm = {};
            realm.region = region;
            realm.name = name;
            realm.connected_realms = connected_realms;
            realm.updated = new Date().getTime();
            bnet.updated = new Date().getTime();
            realm.bnet = bnet;

            //Upsert
            var collection = applicationStorage.mongo.collection("realms");
            collection.updateOne({region: region, name: name}, realm, {upsert: true}, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};
