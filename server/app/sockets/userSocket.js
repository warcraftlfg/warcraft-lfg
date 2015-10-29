"use strict"


/**
 * Provides function which listen socket.io and give user informations.
 */

//Modules dependencies
var userService = process.require("services/userService.js");
var logger = process.require("api/logger.js").get("logger");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();
    //Listen for new user's connections
    io.on('connection', function(socket){

        if(!socket.request.user.logged_in) {
            logger.info("Anonymous user connected");
        }
        else {
            logger.info( socket.request.user.battleTag + " connected");

            /**
             * Return bnet guilds for current user
             */
            socket.on('get:userGuilds', function(region) {
                userService.getGuilds(region,socket.request.user.id, function (error,guilds) {
                    if (error) {
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit("get:userGuilds", guilds);
                });
            });

            /**
             * Return bnet characters for current user
             */
            socket.on('get:userCharacters', function(region) {

                userService.getCharacters(region,socket.request.user.id, function (error,characters) {
                    if (error) {
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit("get:userCharacters", characters);

                });
            });
        }

        //Send to user is informations
        socket.emit('get:user',socket.request.user);
    });


};