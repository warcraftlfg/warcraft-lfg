"use strict";

//Load dependencies
var async = require("async");
var realmModel = process.require("realms/realmModel.js");
var params = process.require("core/utilities/params.js");

/**
 * Add the realm criterion
 * @param query
 * @param criteria
 * @param callback
 */
module.exports.add = function (query, criteria, callback) {

    var paramArray = params.parseQueryParam(query.realm, 2);

    if (paramArray.length > 0) {
        var realmList = [];
        async.each(paramArray, function (param, callback) {
            var region = param[0];
            var name = param[1];
            getConnectedRealms(region, name, function (error, realms) {
                realmList = realmList.concat(realms);
                callback(error);
            });
        }, function (error) {
            if (realmList.length > 0) {
                if (!criteria["$and"]) {
                    criteria["$and"] = [{"$or": realmList}];
                }
                else {
                    criteria["$and"] = criteria["$and"].concat({"$or": realmList});
                }
            }
            callback(error);
        });
    }
    else {
        callback();
    }

};

/**
 * Return the connected realms for a realm
 * @param region
 * @param name
 * @param callback
 */
function getConnectedRealms(region, name, callback) {
    var realmList = [];
    async.waterfall([
        function (callback) {
            realmModel.findOne({region: region, name: name}, {
                region: 1,
                connected_realms: 1,
                "_id": 0
            }, function (error, realm) {
                callback(error, realm);
            });
        },
        function (realm, callback) {
            if (realm && realm.connected_realms) {
                realm.connected_realms.forEach(function (name) {
                    realmList.push({realm: name, region: realm.region});
                });
            }
            callback(null, realmList);
        }
    ], function (error, realmList) {
        callback(error, realmList);
    });

}
