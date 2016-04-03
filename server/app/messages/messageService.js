var async = require("async");
var lodash = require("lodash");
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

    async.waterfall([
        function (callback) {
            var ids = [creatorId];
            if (type == "guild") {
                guildModel.findOne({region: region, realm: realm, name: name}, {id: 1}, function (error, guild) {
                    if (guild && guild.id) {
                        ids = ids.concat(guild.id);
                    }
                    callback(error, ids);
                });
            } else {
                characterModel.findOne({
                    region: region,
                    realm: realm,
                    name: name
                }, {id: 1}, function (error, character) {
                    if (character && character.id) {
                        ids.push(character.id);
                    }
                    callback(error, ids);
                });
            }
        },
        function (ids, callback) {
            var hasPermission = false
            async.each(ids, function (memberId, callback) {
                if (id == memberId) {
                    hasPermission = true;
                }
                callback();
            }, function () {
                callback(null, hasPermission, ids);
            });
        }
    ], function (error, hasPermission, ids) {
        ids = lodash.uniq(ids);

        callback(error, hasPermission, ids);
    });
};

module.exports.dispatchMessage = function () {

};