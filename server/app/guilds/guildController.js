"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var guildCriteria = process.require("guilds/utilities/mongo/guildCriteria.js");
var guildProjection = process.require("guilds/utilities/mongo/guildProjection.js");
var numberLimit = process.require("core/utilities/mongo/numberLimit.js");
var pageSkip = process.require("core/utilities/mongo/pageSkip.js");
var guildSort = process.require("guilds/utilities/mongo/guildSort.js");
var guildService = process.require("guilds/guildService.js");
var updateModel = process.require("updates/updateModel.js");
var characterModel = process.require("characters/characterModel.js");

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
        rank: 1,
        progress: 1,
        perms: 1,
        parser: 1
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

/**
 * Put guild parser info
 * @param req
 * @param res
 */
module.exports.putGuildParser = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    var parser = req.body;
    parser.updated = new Date().getTime();

    async.series([
        function (callback) {
            if (parser && parser.active == true) {
                updateModel.insert('gu', req.params.region, req.params.realm, req.params.name, 5, function (error) {
                    callback(error);
                });
            } else {
                callback();
            }
        },
        function (callback) {
            guildModel.upsert(req.params.region, req.params.realm, req.params.name, {parser: parser}, function (error) {
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

module.exports.getGuildParser = function (req, res) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.query));

    var criteria = {region: req.params.region, realm: req.params.realm, name: req.params.name};
    var guildProjection = {
        _id: 0,
        "bnet.members": 1,
        parser: 1
    };
    var characterProjection = {
        _id: 0,
        region: 1,
        realm: 1,
        name: 1,
        updated: 1,
        parser: 1,
        "bnet.items": 1,
        "bnet.class": 1,
        "bnet.race": 1,
        "bnet.level": 1,
        "bnet.progression.raids": {$slice: [config.currentCharacterProgress, 1]},
        "bnet.talents": 1,
        "warcraftLogs": 1
    };

    async.waterfall([
        function (callback) {

            //Get Guilds  members & parser
            guildModel.findOne(criteria, guildProjection, function (error, guild) {
                callback(error, guild)
            });
        },
        function (guild, callback) {
            if (guild && guild.bnet.members && guild.parser.active) {
                var parserChars = [];
                async.each(guild.bnet.members, function (member, callback) {
                    if (guild.parser.ranks["rank_" + member.rank]) {
                        if (member.character && member.character.realm && member.character.name) {
                            characterModel.findOne({
                                region: req.params.region,
                                realm: member.character.realm,
                                name: member.character.name
                            }, characterProjection, function (error, character) {
                                if (character) {
                                    parserChars.push(character);
                                }
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                }, function (error) {
                    callback(error, parserChars);
                });

            } else {
                callback(true)
            }
        }
    ], function (error, result) {
        if (error == true) {
            req.next();
        } else if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json(result);
        }

    })


};

module.exports.searchGuild = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.query));

    if (req.params.text.length >= 3) {

        var limit = 0;
        if (req.query.number) {
            limit = parseInt(req.query.number, 10);

            if (isNaN(limit)) {
                return;
            }

            limit = limit < 0 ? 0 : limit;
        }
        guildModel.find({name: {$regex: "^" + req.params.text, $options: "i"}},
            {region: 1, realm: 1, name: 1, "bnet.side": 1, _id: 0},
            {name: 1}, limit,
            function (error, guilds) {
                if (error) {
                    logger.error(error.message);
                    res.status(500).send(error.message);
                } else {
                    res.json(guilds);
                }
            }
        );
    }
    else {
        res.json([]);
    }
}
;
