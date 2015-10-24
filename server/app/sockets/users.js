"use strict"


/**
 * Provides function which listen socket.io and give user informations.
 */

//Modules dependencies
var UserModel = process.require("models/UserModel.js");

//Configuration
var logger = process.require("api/logger.js").get("logger");
var userModel = new UserModel();

module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket){

        if(!socket.request.user.logged_in) {
            logger.info("Anonymous user connected");
        }
        else {
            logger.info( socket.request.user.battletag + " connected");

            /**
             * Return bnet guilds for current user
             */
            socket.on('get:user-guilds', function(region) {
                userModel.getGuilds(region,socket.request.user.id, function (error,guilds) {
                    if (error) {
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit("get:user-guilds", guilds);
                });
            });

            /**
             * Return bnet characters for current user
             */
            socket.on('get:user-characters', function(region) {

                userModel.getCharacters(region,socket.request.user.id, function (error,characters) {
                    if (error) {
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit("get:user-characters", characters);

                });
            });
        }

        //Send to user is informations
        socket.emit('get:user',socket.request.user);
    });


};