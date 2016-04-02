"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var validator = process.require('core/utilities/validators/validator.js');

/**
 * Insert a message from an user to another
 * @param ids
 * @param text
 * @param callback
 */
module.exports.insert = function (region, realm, name, type, creatorId, id, text, callback) {
    async.series([
            function (callback) {
                //Validate Params
                validator.validate({
                    text: text,
                    type: type,
                    creatorId: creatorId,
                    charGuild: {region: region, realm: realm, name: name, type:type}
                }, function (error) {
                    callback(error);
                });
                //TODO Add other validation (type,creatorID & Id)
            },
            function (callback) {
                //Upsert
                var collection = applicationStorage.mongo.collection("messages");
                var messageObj = {
                    region: region,
                    realm: realm,
                    name: name,
                    type: type,
                    creatorId: creatorId,
                    id: id,
                    text: text
                };

                collection.insert(messageObj, function (error) {
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

module.exports.getMessages = function (region, realm, name, type, creatorId, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.find({
        type: type,
        creatorId: creatorId,
        region: region,
        realm: realm,
        name: name
    }, {text: 1, id: 1}).toArray(function (error, messages) {
        callback(error, messages)
    });
};

module.exports.getMessageList = function (id, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.aggregate([
        {$match: {$or: [{from: id}, {to: id}]}},
        {
            $group: {
                _id: {type: "$type", region: "$region", realm: "$realm", name: "$name"},
                from: {$addToSet: "$from"},
                to: {$addToSet: "$to"},
            }
        },
        {$project: {ids: {$setDifference: [{$setUnion: ["$from", "$to"]}, [id]]}}}
    ], function (error, messageList) {
        callback(error, messageList)
    });
};