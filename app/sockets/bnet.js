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
        if (socket.request.user.logged_in){
            socket.on('get:bnet-guilds', function(region) {
                userModel.getAccessToken(socket.request.user.id,function(error,accessToken) {
                    userModel.getGuilds(region,accessToken, function (guilds) {
                        socket.emit("get:bnet-guilds", guilds);
                    });
                });
            });
            socket.on('get:bnet-characters', function(region) {
                userModel.getAccessToken(socket.request.user.id,function(error,accessToken) {
                    userModel.getCharacters(region,accessToken, function (characters) {
                        socket.emit("get:bnet-characters", characters);
                    });
                });
            });
        }
    });
};