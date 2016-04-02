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

    messageModel.getMessages(req.params.region, req.params.realm, req.params.name, req.params.type, parseInt(req.params.id, 10), function (error, messages) {
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
module.exports.getConversations = function (req, res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));

    // GET ALL GUILDS FOR USERID
    // GET ALL CHARACTER FOR USERID
    // GET ALL Message with guilds or character or creatorId == USERID --> Aggregate with


    res.json({to: "implement"});
};

/**
 * Insert a message
 * @param req
 * @param res
 */
module.exports.postMessage = function (req, res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.body));

    messageModel.insert(req.body.region, req.body.realm, req.body.name, req.body.type, parseInt(req.body.creatorId, 10), req.user.id, req.body.text, function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });

    //TODO realtime
    /*if (!error) {
     applicationStorage.socketIo.to(applicationStorage.users[ids[0]]).emit("newMessage", messageObj);
     if (ids[0] != ids[1]) {
     applicationStorage.socketIo.to(applicationStorage.users[ids[1]]).emit("newMessage", messageObj);
     }
     }*/
};

