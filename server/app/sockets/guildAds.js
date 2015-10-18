"use strict";
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var async = require("async");
var GuildAdModel = process.require("models/GuildAdModel.js");

//Configuration
var guildAdModel = new GuildAdModel();


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
                guildAdModel.add(socket.request.user.id, guildAd, function (error) {
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
            });

            socket.on('get:guild-ad', function(guildAd) {
                guildAdModel.get(guildAd,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('get:guild-ad',result);
                });
            });

            socket.on('get:user-guild-ads', function(guildAd) {
                guildAdModel.getUserGuildAds(socket.request.user.id,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('get:user-guild-ads',result);
                });
            });
        }
    });
};
