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

        /**
         * All users
         * Return last guilds Ads
         */
        socket.on('get:guild-ads', function() {
            guildAdModel.getLast(function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guild-ads',result);
            });
        });

        if (socket.request.user.logged_in){
            /**
             * Logged In Users
             * Return last guilds Ads
             */
            socket.on('add:guild-ad', function(guildAd) {
                userModel.getAccessToken(socket.request.user.id,function(error,accessToken) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    userModel.getGuilds(guildAd.region,accessToken, function (error,guilds) {
                        if (error){
                            socket.emit("global:error", error.message);
                            return;
                        }
                        var isMyGuild = false;
                        async.forEach(guilds, function (guild, callback) {
                            if (guild.name == guildAd.name && guild.realm == guildAd.realm)
                                isMyGuild = true;
                            callback();
                        });

                        if (isMyGuild) {
                            guildAdModel.add(socket.request.user.id, guildAd, function (error, result) {
                                if (error){
                                    socket.emit("global:error", error.message);
                                    return;
                                }
                                guildAdModel.getLast(function (error, result) {
                                    if (error){
                                        socket.emit("global:error", error.message);
                                        return;
                                    }
                                    io.emit('get:guild-ads', result);
                                    socket.emit('add:guild-ad', result);
                                });
                            });
                        }
                        else {
                            socket.emit('global:error', "NOT_OWNER_ERROR");
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
