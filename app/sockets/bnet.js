"use strict"
/**
 * Provides function which listen socket.io and give bnet informations.
 */

//Modules dependencies
var UserModel = process.require("app/models/UserModel.js");

//Configuration
var userModel = new UserModel();

module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket) {

        //Check if user is logged_in
        if (socket.request.user.logged_in){

            /**
             * Return bnet guilds for current user
             */
            socket.on('get:bnet-guilds', function(region) {
                userModel.getAccessToken(socket.request.user.id,function(error,accessToken) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    userModel.getGuilds(region,accessToken, function (error,guilds) {
                        if (error) {
                            socket.emit("global:error", error.message);
                            return;
                        }
                        socket.emit("get:bnet-guilds", guilds);
                    });
                });
            });

            /**
             * Return bnet characters for current user
             */
            socket.on('get:bnet-characters', function(region) {
                userModel.getAccessToken(socket.request.user.id,function(error,accessToken) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    userModel.getCharacters(region,accessToken, function (error,characters) {
                        if (error) {
                            socket.emit("global:error", error.message);
                            return;
                        }
                        socket.emit("get:bnet-characters", characters);
                    });
                });
            });
        }
    });
};