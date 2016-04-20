"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var validator = process.require('core/utilities/validators/validator.js');

/**
 * Insert a message from an user to another
 * @param objId1
 * @param objId2
 * @param id
 * @param nickName
 * @param text
 * @param callback
 */
module.exports.insert = function (entityId1, entityId2, id, nickName, entities, text, callback) {
    async.waterfall([
            function (callback) {
                //Validate Params
                validator.validate({
                    text: text,
                    charGuildUser: entityId1,
                    charGuildUser2: entityId2,
                }, function (error) {
                    callback(error);
                });
            },
            function (callback) {
                //Upsert
                var collection = applicationStorage.mongo.collection("messages");
                var message = {
                    entitiesIds: [entityId1, entityId2],
                    id: id,
                    nickName: nickName,
                    entities: entities,
                    text: text
                };
                collection.insert(message, function (error) {
                    callback(error, message);
                });
            }
        ],
        function (error, message) {
            callback(error, message);
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
    }, {_id: 1, text: 1, id: 1, battleTag: 1}).toArray(function (error, messages) {
        callback(error, messages)
    });
};

module.exports.getMessageList = function (criteria, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.aggregate([
            {$match: criteria},
            {$sort: {_id: 1}},
            {
                $group: {
                    _id: {type: "$type", region: "$region", realm: "$realm", name: "$name", creatorId: "$creatorId"},
                    battleTags: {$addToSet: "$battleTag"},
                    count: {$sum: 1},
                    creatorBattleTag: {$first: "$battleTag"}
                }

            }
        ],
        function (error, messageList) {
            callback(error, messageList)
        }
    )
    ;
};