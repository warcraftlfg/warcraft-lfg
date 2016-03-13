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
                var messageObj = {
                    from: from,
                    to: to,
                    text: message
                }
                collection.insert(messageObj, function (error) {
                    if (!error) {
                        applicationStorage.socketIo.to(applicationStorage.users[from]).emit("newMessage", messageObj);
                        if (from != to) {
                            applicationStorage.socketIo.to(applicationStorage.users[to]).emit("newMessage", messageObj);
                        }
                    }
                    callback(error);
                });
            }
        ],
        function (error) {
            callback(error);
        }
    )
    ;
}
;

module.exports.find = function (id, id2, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.find({"$or": [{from: id, to: id2}, {from: id2, to: id}]}).toArray(function (error, messages) {
        callback(error, messages)
    });

};