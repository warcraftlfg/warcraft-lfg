"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var validator = process.require('core/utilities/validators/validator.js');

/**
 * Insert a message from an user to another
 * @param from
 * @param to
 * @param message
 * @param callback
 */
module.exports.insert = function (from, to, message, callback) {
    async.series([
        function (callback) {
            //Validate Params
            validator.validate({from: from, to: to, message: message}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            //Upsert
            var collection = applicationStorage.mongo.collection("messages");
            collection.insert({
                from: from,
                to: to,
                message: message
            }, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};