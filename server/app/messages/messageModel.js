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
module.exports.insert = function (objId1, objId2, userId, userName, text, callback) {
    async.waterfall([
            function (callback) {
                //Validate Params
                validator.validate({
                    text: text,
                    charGuildUser: objId1,
                    charGuildUser2: objId2,
                }, function (error) {
                    callback(error);
                });
            },
            function (callback) {
                //Upsert
                var collection = applicationStorage.mongo.collection("messages");

                var objIds = [objId1, objId2].sort();
                var message = {
                    objIds: objIds,
                    userId: userId,
                    userName: userName,
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

module.exports.getMessages = function (objId1, objId2, callback) {
    var collection = applicationStorage.mongo.collection("messages");
    collection.find({
        $or: [{objIds: [objId1, objId2]}, {objIds: [objId2, objId1]}]
    }, {_id: 1, text: 1, userId: 1, userName: 1}).toArray(function (error, messages) {
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
                    _id: {objIds: "$objIds"},
                    userNames: {$addToSet: "$userName"},
                    count: {$sum: 1},
                    creatorUserName: {$first: "$userName"},
                    creatorUserId:{$first: "$userId"}
                }

            }
        ],
        function (error, messageList) {
            callback(error, messageList)
        }
    );
};