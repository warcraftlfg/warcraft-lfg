var async = require("async");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");


/**
 * Chech if the user can create / view a message
 * @param region
 * @param realm
 * @param name
 * @param type
 * @param id
 */
module.exports.hasMessagePermission = function (region, realm, name, type, creatorId, id, callback) {

    if (creatorId == id) {
        return callback(null, true);
    }
    if (type == "guild") {
        var hasPermission = false;
        guildModel.findOne({region: region, realm: realm, name: name}, {id: 1}, function (error, guild) {
            if (guild == null) {
                callback(error, false);
            } else {
                async.each(guild.id, function (memberId, callback) {
                    if (id == memberId) {
                        hasPermission = true;
                    }
                    callback();
                }, function () {
                    callback(error, hasPermission);
                });
            }
        });
    } else {
        characterModel.findOne({region: region, realm: realm, name: name}, {id: 1}, function (error, character) {
            if (character == null) {
                callback(error, false);
            } else {
                callback(error, character.id == id)
            }
        });
    }

};