"use strict"
/**
 * Provides function which listen socket.io and give bnet informations.
 */

//Modules dependencies
var logger = process.require("app/api/logger.js").get("wow-guild-recruitment");
var UserModel = process.require("app/models/UserModel.js");

//Configuration
var userModel = new UserModel();

module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket) {
        if (socket.request.user.logged_in){
            socket.on('get:bnet-guilds', function(region) {
                userModel.getGuilds(socket.request.user.id,region,function(guilds){
                    socket.emit("get:bnet-guilds",guilds);
                });
            });
            socket.on('get:bnet-characters', function(region) {
                userModel.getCharacters(socket.request.user.id,region,function(characters){
                    socket.emit("get:bnet-characters",characters);
                });
            });
        }
    });
};