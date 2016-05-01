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

    messageModel.getMessages(req.params.objId1, req.params.objId2, function (error, messages) {
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

    async.parallel({
        guilds: function (callback) {
            guildModel.find({id: req.user.id}, {_id: 1}, function (error, guilds) {
                callback(error, guilds);
            });
        },
        characters: function (callback) {
            characterModel.find({id: req.user.id}, {_id: 1}, function (error, characters) {
                callback(error, characters);
            });
        }
    }, function (error, results) {

        var objIds = [];
        results.guilds.forEach(function (guild) {
            guild.type = "guild";
            objIds.push(guild._id.toString())
        });
        results.characters.forEach(function (character) {
            character.type = "character";
            objIds.push(character._id.toString())
        });

        messageModel.getMessageList({objIds: {$in: objIds}}, function (error, messageList) {
            if (error) {
                logger.error(error.message);
                res.status(500).send(error.message);
            }
            res.json(messageList);
        });


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

    var userName = req.user.battleTag.split('#')[0];
    messageModel.insert(req.body.objId1, req.body.objId2, req.user.id, userName, req.body.text, function (error, message) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            req.ids.forEach(function (id) {
                applicationStorage.socketIo.to(applicationStorage.users[id]).emit("newMessage", message);
            });
            res.json(message);
        }
    });


};

