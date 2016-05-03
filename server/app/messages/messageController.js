"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var messageModel = process.require("messages/messageModel.js");
var messageService = process.require("messages/messageService.js");
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

    async.parallel({
        entities: function (callback) {
            messageService.getEntities(req.params.objId1, req.params.objId2, function (error, entities) {
                callback(error, entities);
            });
        },
        messages: function (callback) {
            messageModel.getMessages(req.params.objId1, req.params.objId2, function (error, messages) {
                callback(error, messages);
            });
        }
    }, function (error, result) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json(result);
        }
    });


};

/**
 * Return message List
 * @param req
 * @param res
 */
module.exports.getConversations = function (req, res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));

    async.waterfall([
        function (callback) {
            async.parallel({
                guilds: function (callback) {
                    guildModel.find({id: req.user.id,"ad.lfg":{$exists:true}}, {_id: 1}, function (error, guilds) {
                        callback(error, guilds);
                    });
                },
                characters: function (callback) {
                    characterModel.find({id: req.user.id,"ad.lfg":{$exists:true}}, {_id: 1}, function (error, characters) {
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

                messageModel.getMessageList({objIds: {$in: objIds}}, function (error, conversationsList) {
                    callback(error,conversationsList);
                });


            });
        },
        function (conversationsList,callback) {
            async.each(conversationsList,function(conversation,callback){
                messageService.getEntities(conversation._id.objIds[0],conversation._id.objIds[1],function(error,entities){
                    conversation.entities = entities;
                    delete conversation._id;
                    callback(error);
                });
            },function(error){
                callback(error,conversationsList)
            });
        }
    ], function (error, result) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        }
        else {
            res.json(result);
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

    var userName = req.user.battleTag.split('#')[0];

    messageModel.insert(req.body.objId1, req.body.objId2, req.user.id, userName, req.body.text, function (error, message) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            req.ids.forEach(function (id) {
                applicationStorage.users[id].forEach(function(socketId){
                    applicationStorage.socketIo.to(socketId).emit("newMessage", message);
                });
            });
            res.json(message);
        }
    });


};

