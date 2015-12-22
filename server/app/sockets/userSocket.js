"use strict";

//Modules dependencies
var userService = process.require("services/userService.js");
var logger = process.require("api/logger.js").get("logger");
var applicationStorage = process.require("api/applicationStorage.js");


//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();

    io.on('connection', function(socket){
        if(!socket.request.user.logged_in) {
            logger.info("Anonymous user connected");
        }
        else {
            logger.info( socket.request.user.battleTag + " connected");

            //Send to user is information
            socket.emit('get:user',socket.request.user);

            socket.on('get:userGuilds', function(region) {
                logger.debug('get:userGuilds',socket.request.user);

                userService.getGuilds(region,socket.request.user.id, function (error,guilds) {
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit("get:userGuilds", guilds);
                });
            });

            socket.on('get:userCharacters', function(region) {
                logger.debug('get:userCharacters',socket.request.user);

                userService.getCharacters(region,socket.request.user.id, function (error,characters) {
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit("get:userCharacters", characters);
                });
            });

            socket.on('get:userGuildRank', function(guild) {
                logger.debug('get:userGuildRank',socket.request.user);

                userService.getGuildRank(socket.request.user.id,guild.region,guild.realm,guild.name, function (error,rank) {
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit("get:userGuildRank", rank);
                });
            });
        }
    });
};