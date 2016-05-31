"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var guildCriteria = process.require("guilds/utilities/mongo/guildCriteria.js");
var guildProjection = process.require("guilds/utilities/mongo/guildProjection.js");
var numberLimit = process.require("core/utilities/mongo/numberLimit.js");
var guildSort = process.require("guilds/utilities/mongo/guildSort.js");
var guildService = process.require("guilds/guildService.js");
var updateModel = process.require("updates/updateModel.js");

/**
 * Return guilds
 * @param req
 * @param res
 */
module.exports.getGuilds = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.query));

    async.waterfall([
            function (callback) {
                guildCriteria.get(req.query, function (error, criteria) {
                    callback(error, criteria);
                });
            },
            function (criteria, callback) {
                callback(null, criteria, guildProjection.get(req.query));
            },
            function (criteria, projection, callback) {
                callback(null, criteria, projection, numberLimit.get(req.query));
            },
            function (criteria, projection, limit, callback) {
                callback(null, criteria, projection, limit, guildSort.get(req.query));
            },
            function (criteria, projection, limit, sort, callback) {
                logger.debug("guilds - criteria:%s projection:%s limit:%s sort:%s", JSON.stringify(criteria), JSON.stringify(projection), JSON.stringify(limit), JSON.stringify(sort));
                guildModel.find(criteria, projection, sort, limit, function (error, guilds) {
                    callback(error, guilds);
                });
            }

        ],
        function (error, guilds) {
            if (error) {
                logger.error(error.message);
                res.status(500).send(error.message);
            }
            res.json(guilds);
        }
    )
    ;
}
;

/**
 * return one guild
 * @param req
 * @param res
 * @param next
 */
module.exports.getGuild = function (req, res, next) {

    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    var criteria = {region: req.params.region, realm: req.params.realm, name: req.params.name};
    var projection = {
        _id: 1,
        id: 1,
        region: 1,
        realm: 1,
        name: 1,
        ad: 1,
        updated: 1,
        bnet: 1,
        wowProgress: 1,
        progress: 1
    };
    guildModel.findOne(criteria, projection, function (error, guild) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        }

        if (guild) {
            res.json(guild);
        }
        else {
            next();
        }
    });
};

/**
 * Put guild
 * @param req
 * @param res
 */
module.exports.putGuildAd = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    var ad = req.body;

    async.series([
        function (callback) {
            ad.updated = new Date().getTime();
            guildModel.upsert(req.params.region, req.params.realm, req.params.name, {ad: ad}, function (error) {
                callback(error);
            });
        },
        function (callback) {
            updateModel.insert("gu", req.params.region, req.params.realm, req.params.name, 10, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });
};


/**
 * Delete Guild AD
 * @param req
 * @param res
 */
module.exports.deleteGuildAd = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    guildModel.deleteAd(req.params.region, req.params.realm, req.params.name, function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });

};

/**
 * Put guild perms
 * @param req
 * @param res
 */
module.exports.putGuildPerms = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    var perms = req.body;
    perms.updated = new Date().getTime();
    guildModel.upsert(req.params.region, req.params.realm, req.params.name, {perms: perms}, function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });

};


module.exports.getCount = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.query));

    async.waterfall([
        function (callback) {
            guildCriteria.get(req.query, function (error, criteria) {
                callback(error, criteria);
            });
        },
        function (criteria, callback) {
            logger.debug("guilds count - criteria:%s projection:%s limit:%s sort:%s", JSON.stringify(criteria));
            guildModel.count(criteria, function (error, count) {
                callback(error, count);
            });
        }

    ], function (error, count) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        }
        res.json({count: count});
    });
};