var async = require("async");
var lodash = require("lodash");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");
var userModel = process.require("users/userModel.js");
var ObjectId = require('mongodb').ObjectId;


/**
 * Check if the user can create / view a message
 * @param objId1
 * @param objId2
 * @param id
 * @param callback
 */
module.exports.hasMessagePermission = function (entityFrom, entityTo, id, callback) {


    var or = [];
    if (ObjectId.isValid(entityFrom)) {
        or.push({_id: ObjectId(entityFrom)});
    }
    if (ObjectId.isValid(entityTo)) {
        or.push({_id: ObjectId(entityTo)});
    }

    async.parallel({
            characters: function (callback) {

                if (or.length > 0) {
                    characterModel.find({$or: or}, {region: 1, realm: 1, name: 1, id: 1}, function (error, characters) {
                        callback(error, characters);
                    });
                } else {
                    callback();
                }
            },
            guilds: function (callback) {
                if (or.length > 0) {
                    guildModel.find({$or: or}, {region: 1, realm: 1, name: 1, id: 1}, function (error, guilds) {
                        callback(error, guilds);
                    });
                } else {
                    callback();
                }
            },
            users: function (callback) {
                userModel.find({$or: [{id: parseInt(entityFrom, 10)}, {id: parseInt(entityTo, 10)}]}, {
                    id: 1,
                    battleTag: 1
                }, function (error, users) {
                    callback(error, users);
                });
            }
        },
        function (error, result) {
            var ids = [];
            var entities = [];

            if (result.guilds) {
                result.guilds.forEach(function (guild) {
                    if (guild.id) {
                        ids = ids.concat(guild.id);
                    }
                    guild.type = "guild";
                    entities.push(guild);
                });
            }

            if (result.characters) {
                result.characters.forEach(function (character) {
                    if (character.id) {
                        ids.push(character.id);
                    }
                    character.type = "character";
                    entities.push(character);
                });
            }

            if (result.users) {
                result.users.forEach(function (user) {
                    if (user.id) {
                        ids.push(user.id);
                    }
                    user.type = "user";
                    delete user.battleTag;
                    entities.push(user);
                });
            }

            var hasPermission = false;
            ids = lodash.uniq(ids);
            ids.forEach(function (userId) {
                if (id == userId) {
                    hasPermission = true;
                }
            });
            callback(error, hasPermission, ids, entities);
        });
};