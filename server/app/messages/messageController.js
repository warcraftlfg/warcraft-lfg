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

    messageModel.getMessages(req.user.id, parseInt(req.params.id, 10), req.params.type, req.params.region, req.params.realm, req.params.name, function (error, messages) {
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
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));

    messageModel.insert(req.user.id, parseInt(req.body.id, 10), req.body.type, req.body.region, req.body.realm, req.body.name, req.body.text, function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });


};

