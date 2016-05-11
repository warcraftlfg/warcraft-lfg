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

    var or = [];
    if (ObjectId.isValid(objId1)) {
        or.push({_id: ObjectId(objId1)});
    }
    if (ObjectId.isValid(objId2)) {
        or.push({_id: ObjectId(objId2)});
    }
    async.parallel({
            characters: function (callback) {
                if (or.length > 0) {
                    characterModel.find({$or: or}, {id: 1}, function (error, characters) {
                        callback(error, characters);
                    });
                } else {
                    callback();
                }

            },
            guilds: function (callback) {
                if (or.length > 0) {
                    guildModel.find({$or: or}, {id: 1}, function (error, guilds) {
                        callback(error, guilds);
                    });
                } else {
                    callback();
                }

            },
            users: function (callback) {
                userModel.find({$or: [{id: parseInt(objId1, 10)}, {id: parseInt(objId2, 10)}]}, {
                    id: 1
                }, function (error, users) {
                    callback(error, users);
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

            if (result.users) {
                result.users.forEach(function (user) {
                    if (user.id) {
                        ids.push(user.id);
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

    var or = [];
    if (ObjectId.isValid(objId1)) {
        or.push({_id: ObjectId(objId1)});
    }
    if (ObjectId.isValid(objId2)) {
        or.push({_id: ObjectId(objId2)});
    }
    async.parallel({
            characters: function (callback) {
                if (or.length > 0) {
                    characterModel.find({$or: or}, {region: 1, realm: 1, name: 1, id: 1,"bnet.faction":1, "bnet.class":1}, function (error, characters) {
                        callback(error, characters);
                    });
                } else {
                    callback();
                }

            },
            guilds: function (callback) {
                if (or.length > 0) {
                    guildModel.find({$or: or}, {region: 1, realm: 1, name: 1, id: 1,"bnet.side":1}, function (error, guilds) {
                        callback(error, guilds);
                    });
                } else {
                    callback();
                }

            },
            users: function (callback) {
                userModel.find({$or: [{id: parseInt(objId1, 10)}, {id: parseInt(objId2, 10)}]}, {
                    id: 1,
                    battleTag: 1,
                    _id: 0
                }, function (error, users) {
                    callback(error, users);
                });
            }
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

            if (result.users) {
                result.users.forEach(function (user) {
                    if (user.id) {
                        user.type = "user";
                        user.name = user.battleTag.split('#')[0];
                        delete user.battleTag;
                        entities.push(user);
                    }
                });
            }


            callback(error, entities);
        });
};
