"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var guildPermsSchema = process.require('config/db/guildPermsSchema.json');
var validator = process.require('core/utilities/validators/validator.js');
var Confine = require("confine");

/**
 * Get the guilds
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param skip
 * @param callback
 */
module.exports.find = function (criteria, projection, sort, limit, skip, callback) {
    var collection = applicationStorage.mongo.collection("guilds");
    if (skip === undefined && limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    } else if (skip === undefined && callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    } else if (callback == undefined) {
        callback = skip;
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).skip(skip).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    }
};

/**
 * Get one guild
 * @param criteria
 * @param projection
 * @param callback
 */
module.exports.findOne = function (criteria, projection, callback) {
    var collection = applicationStorage.mongo.collection("guilds");
    collection.findOne(criteria, projection, function (error, guild) {

        //Sanitize before return
        if (guild) {
            var confine = new Confine();
            guild.ad = confine.normalize(guild.ad, guildAdSchema);
            guild.perms = confine.normalize(guild.perms, guildPermsSchema);
        }
        callback(error, guild);
    });
};

/**
 * Return the number of guilds
 * @param criteria
 * @param callback
 */
module.exports.count = function (criteria, callback) {
    var collection = applicationStorage.mongo.collection("guilds");
    collection.count(criteria, function (error, count) {
        callback(error, count);
    });
};

/**
 * Update or insert objects for the guild
 * @param region
 * @param realm
 * @param name
 * @param obj
 * @param callback
 */
module.exports.upsert = function (region, realm, name, obj, callback) {
    async.series([
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var guild = {};


            //Sanitize ad object
            if (obj.ad) {
                var confine = new Confine();
                guild.ad = confine.normalize(obj.ad, guildAdSchema);
            }

            if (obj.bnet) {
                guild.bnet = obj.bnet;
            }

            if (obj.perms) {
                guild.perms = obj.perms;
            }

            if (obj.wowProgress) {
                guild.wowProgress = obj.wowProgress;
            }

            if (obj.progress) {
                guild.progress = obj.progress;
            }

            if (obj.rank) {
                guild.rank = obj.rank;
            }

            //Format value
            region = region.toLowerCase();

            guild.region = region;
            guild.realm = realm;
            guild.name = name;
            guild.updated = new Date().getTime();

            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({
                region: region,
                realm: realm,
                name: name
            }, {$set: guild}, {upsert: true}, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};

/**
 * Delete Ad for the guild
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.deleteAd = function (region, realm, name, callback) {
    async.series([
        function (callback) {
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region: region, realm: realm, name: name}, {$unset: {ad: ""}}, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};

/**
 * set lfg to false for ads of 3 month old
 * @param callback
 */
module.exports.disableLfgForOldAds = function (callback) {
    var timestamp = new Date().getTime() - (120 * 24 * 3600 * 1000);
    var collection = applicationStorage.mongo.collection("guilds");
    collection.updateMany({
        "ad.updated": {$lte: timestamp},
        "ad.lfg": true
    }, {$set: {"ad.lfg": false}}, function (error) {
        callback(error);
    });
};

/**
 * AddtoSet ID
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.setId = function (region, realm, name, id, callback) {
    async.series([
        function (callback) {
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name, id: id}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({
                region: region,
                realm: realm,
                name: name
            }, {$addToSet: {id: id}}, {upsert: true}, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};

/**
 *
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.removeId = function (region, realm, name, id, callback) {
    async.series([
        function (callback) {
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function (callback) {
            //Validate Params
            validator.validate({region: region, realm: realm, name: name, id: id}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region: region, realm: realm, name: name}, {$pull: {id: id}}, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });
};
