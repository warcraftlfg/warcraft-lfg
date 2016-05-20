"use strict";
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var characterModel = process.require("characters/characterModel.js");
var userModel = process.require("users/userModel.js");
var ObjectId = require('mongodb').ObjectId;

/**
 * Validate existance of character guild or user Object param
 * @param entityId
 * @param callback
 */
module.exports.validate = function (entityId, callback) {
    async.parallel({
        guild: function (callback) {
            if (ObjectId.isValid(entityId)) {
                guildModel.findOne({_id: ObjectId(entityId)}, {_id: 1}, function (error, guild) {
                    callback(error, guild);
                });
            } else {
                callback();
            }
        },
        character: function (callback) {
            if (ObjectId.isValid(entityId)) {
                characterModel.findOne({_id: ObjectId(entityId)}, {_id: 1}, function (error, character) {
                    callback(error, character);
                });
            } else {
                callback();
            }
        },
        user: function (callback) {
            userModel.findById(parseInt(entityId,10), function (error, user) {
                callback(error, user);
            });
        }
    }, function (error, result) {
        if (result.guild == null && result.character == null && result.user == null) {
            return callback(new Error('NOTFOUND_OBJECT_VALIDATION_ERROR'));
        }
        callback(error);
    });
};

