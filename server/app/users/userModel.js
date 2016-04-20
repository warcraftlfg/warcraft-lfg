"use strict";

//Defines dependencies
var userSchema = process.require('config/db/userSchema.json');
var applicationStorage = process.require("core/applicationStorage.js");
var Confine = require("confine");

/**
 * Update or insert user object
 * @param user
 * @param callback
 */
module.exports.upsert = function (user, callback) {

    //Sanitize json
    var confine = new Confine();
    user = confine.normalize(user, userSchema);

    //Validation
    if (user.id == null) {
        callback(new Error('Field id is required in userModel'));
        return;
    }
    if (user.battleTag == null) {
        callback(new Error('Field battleTag is required in userModel'));
        return;
    }
    if (user.accessToken == null) {
        callback(new Error('Field accessToken is required in userModel'));
        return;
    }

    //Upsert
    var collection = applicationStorage.mongo.collection("users");
    collection.update({id: user.id}, user, {upsert: true}, function (error, result) {
        callback(error, result);
    });
};

/**
 * Return the user with id set in params
 * @param id
 * @param callback
 */
module.exports.findById = function (id, callback) {
    var collection = applicationStorage.mongo.collection("users");
    collection.findOne({id: id}, {_id: 0}, function (error, user) {
        callback(error, user);
    });
};

/**
 * Get the users
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param hint
 * @param callback
 */
module.exports.find = function (criteria, projection, sort, limit, hint, callback) {
    var collection = applicationStorage.mongo.collection("users");
    if (hint === undefined && limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, users) {
            callback(error, users);
        });
    } else if (hint === undefined && callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, users) {
            callback(error, users);
        });
    } else if (callback == undefined) {
        callback = hint;
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, users) {
            callback(error, users);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).hint(hint).toArray(function (error, users) {
            callback(error, users);
        });
    }
};
