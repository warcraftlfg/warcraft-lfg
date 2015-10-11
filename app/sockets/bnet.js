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
            socket.on('get:bnet-guilds', function() {
                userModel.getGuild(socket.request.user.id,function(guilds){
                    socket.emit("get:bnet-guilds",guilds);
                });
            });
        }
    });
};