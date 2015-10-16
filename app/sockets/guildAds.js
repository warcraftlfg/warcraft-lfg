"use strict"
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var async = require("async");
var GuildAdModel = process.require("app/models/GuildAdModel.js");
var UserModel = process.require("app/models/UserModel.js");

//Configuration
var guildAdModel = new GuildAdModel();
var userModel = new UserModel();

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
            socket.on('add:guild-ad', function(guildAd) {
                //TODO Vérifier que l'utilisateur est bien dans la guilde qu'il rajoute
                userModel.getAccessToken(socket.request.user.id,function(error,accessToken) {

                    userModel.getGuilds(guildAd.region,accessToken, function (guilds) {
                        var isMyGuild = false;
                        async.forEach(guilds, function (guild, callback) {
                            if (guild.name == guildAd.name && guild.realm == guildAd.realm)
                                isMyGuild = true;
                            callback();
                        });

                        if (isMyGuild) {
                            guildAdModel.add(socket.request.user.id, guildAd, function (error, result) {
                                guildAdModel.getLast(function (error, result) {
                                    io.emit('get:guild-ads', result);
                                    socket.emit('add:guild-ad', result);
                                });
                            });
                        }
                        else {
                            socket.emit('global:error', "GUILDAD_NOT_OWNER");
                        }

                    });
                });
            });

            socket.on('get:guild-ad', function(guildAd) {
                guildAdModel.get(guildAd,function(error,result){
                    socket.emit('get:guild-ad',result);
                });
            });

            socket.on('get:user-guild-ads', function(guildAd) {
                guildAdModel.getUserGuildAds(socket.request.user.id,function(error,result){
                    socket.emit('get:user-guild-ads',result);
                });
            });

        }

    });
};
