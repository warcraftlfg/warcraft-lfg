"use strict";
var applicationStorage = process.require("core/applicationStorage.js");
/**
 * Validate userId param
 * @param userId
 * @param callback
 */
module.exports.validate = function (userId, callback) {
    if (userId == null) {
        return callback(new Error('MISSING_USERID_VALIDATION_ERROR'));
    }
    var collection = applicationStorage.mongo.collection("users");
    collection.findOne(
        {
            id: userId
        }, {id: 1},
        function (error, user) {
            if (!user) {
                return callback(new Error('NOTFOUND_USERID_VALIDATION_ERROR'));
            }
            callback(error);
        });
};

