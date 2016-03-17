"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var messageModel = process.require("messages/messageModel.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");

/**
 * Return messages
 * @param req
 * @param res
 */
module.exports.getMessages = function (req, res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));

    async.waterfall([
            function (callback) {
                if (req.params.type == "character") {
                    characterModel.findOne({
                        region: req.params.region,
                        realm: req.params.realm,
                        name: req.params.name
                    }, {id: 1}, function (error, character) {
                        if (character) {
                            callback(error, character.id);
                        } else {
                            callback(new Error("CHARACTER_NOT_FOUND"));
                        }
                    });
                } else {
                    guildModel.findOne({
                        region: req.params.region,
                        realm: req.params.realm,
                        name: req.params.name
                    }, {id: 1}, function (error, guild) {
                        if (guild) {
                            callback(error, guild.id);
                        } else {
                            callback(new Error("GUILD_NOT_FOUND"));
                        }
                    });
                }
            },
            function (id, callback) {
                messageModel.getMessages(req.user.id, id, req.params.type, req.params.region, req.params.realm, req.params.name, function (error, messages) {
                        callback(error, messages);
                    }
                )
                ;
            }
        ],
        function (error, messages) {
            if (error) {
                logger.error(error.message);
                res.status(500).send(error.message);
            }
            res.json(messages);
        }
    );
};

/**
 * Return message List
 * @param req
 * @param res
 */
module.exports.getMessageList = function (req, res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));

    messageModel.getMessageList(req.user.id, function (error, messagesList) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json(messagesList);
        }
    });
};

/**
 * Insert a message
 * @param req
 * @param res
 */
module.exports.postMessage = function (req, res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.body));
    async.waterfall([
            function (callback) {
                if (req.body.type == "character") {
                    characterModel.findOne({
                        region: req.body.region,
                        realm: req.body.realm,
                        name: req.body.name
                    }, {id: 1}, function (error, character) {
                        if (character) {
                            callback(error, character.id);
                        } else {
                            callback(new Error("CHARACTER_NOT_FOUND"));
                        }
                    });
                } else {
                    guildModel.findOne({
                        region: req.body.region,
                        realm: req.body.realm,
                        name: req.body.name
                    }, {id: 1}, function (error, guild) {
                        if (guild) {
                            callback(error, guild.id);
                        } else {
                            callback(new Error("GUILD_NOT_FOUND"));
                        }
                    });
                }
            },
            function (id, callback) {
                messageModel.insert(req.user.id, id, req.body.type, req.body.region, req.body.realm, req.body.name, req.body.text, function (error) {
                        callback(error);
                    }
                );
            }
        ],
        function (error) {
            if (error) {
                logger.error(error.message);
                res.status(500).send(error.message);
            }
            res.json();
        }
    );


};

