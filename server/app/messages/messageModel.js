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
module.exports.insert = function (from, to, type, region, realm, name, text, callback) {
    async.series([
            function (callback) {
                //Validate Params
                validator.validate({
                    from: from,
                    to: to,
                    message: text,
                    type: type,
                    region: region,
                    realm: realm,
                    name: name
                }, function (error) {
                    callback(error);
                });
            },
            function (callback) {
                //Upsert
                var collection = applicationStorage.mongo.collection("messages");
                var messageObj = {
                    from: from,
                    to: to,
                    type: type,
                    region: region,
                    realm: realm,
                    name: name,
                    text: text
                };
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

module.exports.getMessages = function (id, id2, type, region, realm, name, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.find({
        "$or": [{from: id, to: id2}, {from: id2, to: id}],
        type: type,
        region: region,
        realm: realm,
        name: name
    }).toArray(function (error, messages) {
        callback(error, messages)
    });
};

module.exports.getMessageList = function (id, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.aggregate([
        {$match: {$or: [{from: id, to: id}]}},
        {
            $group: {
                _id: {type: "$type", region: "$region", realm: "$realm", name: "$name"},
                count: {$sum: 1},
                ids: {$addToSet: {from: "$from", to: "$to"}}
            },

        },

    ], function (error, messageList) {
        callback(error, messageList)
    });

};