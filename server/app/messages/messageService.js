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
module.exports.hasMessagePermission = function (objId1, objId2, id, callback) {

    if (!ObjectId.isValid(objId1) || !ObjectId.isValid(objId2)) {
        return callback(new Error("Invalid Object ID"));
    }

    async.parallel({
            characters: function (callback) {
                characterModel.find({$or: [{_id: ObjectId(objId1)}, {_id: ObjectId(objId2)}]}, {id: 1}, function (error, characters) {
                    callback(error, characters);
                });
            },
            guilds: function (callback) {
                guildModel.find({$or: [{_id: ObjectId(objId1)}, {_id: ObjectId(objId2)}]}, {id: 1}, function (error, guilds) {
                    callback(error, guilds);
                });
            }
        },
        function (error, result) {
            var ids = [];
            if (result.guilds) {
                result.guilds.forEach(function (guild) {
                    if (guild.id) {
                        ids = ids.concat(guild.id);
                    }
                });
            }

            if (result.characters) {
                result.characters.forEach(function (character) {
                    if (character.id) {
                        ids.push(character.id);
                    }
                });
            }

            var hasPermission = false;
            ids = lodash.uniq(ids);
            ids.forEach(function (userId) {
                if (userId == id) {
                    hasPermission = true;
                }
            });

            callback(error, hasPermission, ids);
        });
};

module.exports.getEntities = function (objId1, objId2, callback) {

    if (!ObjectId.isValid(objId1) || !ObjectId.isValid(objId2)) {
        return callback(new Error("Invalid ObjectID"));
    }

    async.parallel({
            characters: function (callback) {
                characterModel.find({$or: [{_id: ObjectId(objId1)}, {_id: ObjectId(objId2)}]}, {
                    region: 1,
                    realm: 1,
                    name: 1,
                    id: 1,
                    "bnet.faction": 1,
                    "bnet.class": 1
                }, function (error, characters) {
                    callback(error, characters);
                });
            },
            guilds: function (callback) {
                guildModel.find({$or: [{_id: ObjectId(objId1)}, {_id: ObjectId(objId2)}]}, {
                    region: 1,
                    realm: 1,
                    name: 1,
                    id: 1,
                    "bnet.side": 1
                }, function (error, guilds) {
                    callback(error, guilds);
                });
            },
        },
        function (error, result) {
            var entities = [];
            if (result.guilds) {
                result.guilds.forEach(function (guild) {
                    if (guild.id) {
                        guild.type = "guild";
                        entities.push(guild);
                    }
                });
            }

            if (result.characters) {
                result.characters.forEach(function (character) {
                    if (character.id) {
                        character.type = "character";
                        entities.push(character);
                    }
                });
            }
            callback(error, entities);
        });
};
