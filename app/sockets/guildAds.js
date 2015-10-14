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
        //All users function
        socket.on('get:guild-ads', function() {
            guildAdModel.getLast(function(error,result){
                socket.emit('get:guild-ads',result);
            });
        });

        //User logged only function
        if (socket.request.user.logged_in){
            socket.on('add:guild-ad', function(guild_ad) {
                //TODO Vérifier que l'utilisateur est bien dans la guilde qu'il rajoute
                guildAdModel.add(socket.request.user.id,guild_ad,function(error,result){
                    io.emit('add:guild-ad',guild_ad);
                });
            });
        }

    });
};
