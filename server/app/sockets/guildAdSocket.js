"use strict";
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var async = require("async");
var guildAdModel = process.require("models/GuildAdModel.js");


module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket) {

        /**
         * All users
         */
        socket.on('get:guildAds', function() {
            guildAdModel.getLast(10,function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guildAds',result);
            });
        });

        socket.on('get:guildAd', function(guildAd) {
            guildAdModel.get(guildAd,function(error,result){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guildAd',result);
            });
        });

        /**
         * Authenticate Users
         */
        if (socket.request.user.logged_in){
            socket.on('put:guildAd', function(guildAd) {
                guildAdModel.insertOrUpdate(socket.request.user.id,guildAd,function(error,guildAd){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    guildAdModel.getLast(10,function (error, guildAds) {
                        if (error){
                            socket.emit("global:error", error.message);
                            return;
                        }
                        io.emit('get:guildAds', guildAds);
                        socket.emit('put:guildAd', guildAd);
                    });

                });
            });
            socket.on('delete:guildAd', function(guildAd) {
                guildAdModel.delete(socket.request.user.id,guildAd,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('delete:guildAd',result);
                });
            });

            socket.on('get:userGuildAds', function(guildAd) {
                guildAdModel.getUserGuildAds(socket.request.user.id,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('get:userGuildAds',result);
                });
            });
        }
    });
};


