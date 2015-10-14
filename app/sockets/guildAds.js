"use strict"
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var GuildAdModel = process.require("app/models/GuildAdModel.js");

//Configuration
var guildAdModel = new GuildAdModel();

module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket) {
        //Check if user is logged before anything
        if (socket.request.user.logged_in){
            socket.on('add:guild-ad', function(guild_ad) {
                console.log(guild_ad);
                guildAdModel.add(socket.request.user.id,guild_ad,function(error,result){
                    io.emit('add:guild-ad',guild_ad);
                });
            });
        }
    });
};
