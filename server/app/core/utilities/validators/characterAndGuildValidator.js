"use strict";
var applicationStorage = process.require("core/applicationStorage.js");
/**
 * Validate character or guild Object param
 * @param obj
 * @param callback
 */
module.exports.validate = function (obj, callback) {
    var collection = applicationStorage.mongo.collection("guilds");

    if (obj.type == "character") {
        collection = applicationStorage.mongo.collection("characters");
    }
    
    collection.findOne(
        {
            region: obj.region,
            realm: obj.realm,
            name: obj.name
        }, {region: 1, realm: 1, name: 1},
        function (error, result) {

            if (!result) {
                return callback(new Error('NOTFOUND_OBJECT_VALIDATION_ERROR'));
            }
            callback(error);
        });
};

