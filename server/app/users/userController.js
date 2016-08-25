"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");
var userService = process.require("users/userService.js");
var conversationModel = process.require("users/conversationModel.js");
var userModel = process.require("users/userModel.js");
var async = require("async");


/**
 * Logout function for express
 * @param req
 * @param res
 */
module.exports.logout = function (req, res) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var redirect = config.oauth.bnet.callbackURL;
    if (config.server.html5) {
        redirect += "/redirect";
    } else {
        redirect += "/#/redirect";
    }
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));
    req.logout();
    res.redirect(redirect);
};
module.exports.logoutLfg = function (req, res) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var redirect = config.oauth.bnet.callbackLfgURL;
    if (config.server.html5) {
        redirect += "/redirect";
    } else {
        redirect += "/#/redirect";
    }
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));
    req.logout();
    res.redirect(redirect);
};
module.exports.logoutProgress = function (req, res) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var redirect = config.oauth.bnet.callbackProgressURL;
    if (config.server.html5) {
        redirect += "/redirect";
    } else {
        redirect += "/#/redirect";
    }
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));
    req.logout();
    res.redirect(redirect);
};
module.exports.logoutParser = function (req, res) {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var redirect = config.oauth.bnet.callbackParserURL;
    if (config.server.html5) {
        redirect += "/redirect";
    } else {
        redirect += "/#/redirect";
    }
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));
    req.logout();
    res.redirect(redirect);
};

/**
 * Get the user informations
 * @param reqapplicationStorage.logger
 * @param res
 */
module.exports.getProfile = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s  %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));
    res.json(req.user);
};

/**
 *
 * @param req
 * @param res
 */
module.exports.getCharacterAds = function (req, res) {
    var logger = applicationStorage.logger;
    var criteria = {id: req.user.id, "ad.lfg": {$exists: true}};
    var projection = {_id: 1, name: 1, realm: 1, region: 1, "ad.updated": 1, "ad.lfg": 1, "bnet.class": 1};
    var sort = {"ad.updated": -1};

    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    characterModel.find(criteria, projection, sort, function (error, characters) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(characters);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
module.exports.getGuildAds = function (req, res) {
    var logger = applicationStorage.logger;

    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    var criteria = {id: req.user.id, "ad.lfg": {$exists: true}};
    var projection = {_id: 1, name: 1, realm: 1, region: 1, "ad.updated": 1, "ad.lfg": 1, "bnet.side": 1, "perms": 1, "parser.active": 1};
    var sort = {"ad.updated": -1};
    async.waterfall([
        function (callback) {
            guildModel.find(criteria, projection, sort, function (error, guilds) {
                callback(error, guilds)
            });
        },
        function (guilds, callback) {
            async.each(guilds, function (guild, callback) {
                userService.getGuildRank(guild.region, guild.realm, guild.name, req.user.id, function (error, rank) {
                    guild.rank = rank;
                    callback(error);
                }, function (error) {
                    callback(error);
                });
            }, function (error) {
                callback(error, guilds);
            });
        }
    ], function (error, guilds) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(guilds);
        }
    });


};

/**
 *
 * @param req
 * @param res
 */
module.exports.getCharacters = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));


    userService.getCharacters(req.params.region, req.user.id, function (error, characters) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(characters);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
module.exports.getGuilds = function (req, res) {
    var logger = applicationStorage.logger;

    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    userService.getGuilds(req.params.region, req.user.id, function (error, guilds) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(guilds);
        }
    });

};


/**
 *
 * @param req
 * @param res
 */
module.exports.getGuildRank = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    userService.getGuildRank(req.params.region, req.params.realm, req.params.name, req.user.id, function (error, rank) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json({rank: rank});
        }
    });

};

module.exports.putProfile = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.body));


    async.waterfall([
        function (callback) {
            userModel.findById(req.user.id, function (error, user) {
                callback(error, user);
            });
        },
        function (user, callback) {
            //Set only the email and language to current user // battleTag, id, token cannot be changed by user
            user.email = req.body.email;
            user.language = req.body.language;
            userModel.upsert(user, function (error, user) {
                delete user.accessToken;
                callback(error, user)
            });
        }
    ], function (error, user) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(user);
        }
    });
};

/**
 * Return the UnreadMessageCount for current user
 * @param req
 * @param res
 */
module.exports.getUnreadMessageCount = function (req, res) {
    var logger = applicationStorage.logger;
    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    conversationModel.getCount(req.user.id,function(error,count){
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(count[0]);
        }
    });
};