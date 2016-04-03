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

    async.parallel({
        guilds: function (callback) {
            guildModel.find({id: req.user.id}, {region: 1, realm: 1, name: 1, _id: 0}, function (error, guilds) {
                callback(error, guilds);
            });
        },
        characters: function (callback) {
            characterModel.find({id: req.user.id}, {
                region: 1,
                realm: 1,
                name: 1,
                _id: 0
            }, function (error, characters) {
                callback(error, characters);
            });
        }
    }, function (error, results) {

        var or = [];
        results.guilds.forEach(function (guild) {
            guild.type = "guild";
            or.push(guild)
        });
        results.characters.forEach(function (character) {
            character.type = "character";
            or.push(character)
        });
        or.push({creatorId: req.user.id});

        messageModel.getMessageList({$or: or}, function (error, messageList) {
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

    messageModel.insert(req.body.region, req.body.realm, req.body.name, req.body.type, parseInt(req.body.creatorId, 10), req.user.id, req.user.battleTag, req.body.text, function (error, message) {
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

