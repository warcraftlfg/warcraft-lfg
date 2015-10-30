"use strict";
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var async = require("async");
var guildModel = process.require("models/guildModel.js");
var guildService = process.require("services/guildService.js");
var applicationStorage = process.require("api/applicationStorage.js");


module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();
    var self=this;
    //Listen for new user's connections
    io.on('connection', function(socket) {

        /**
         * All users
         */
        socket.on('get:lastGuildAds', function() {
            guildService.getLastAds(function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:lastGuildAds',result);
            });
        });

        socket.on('get:guild', function(guildIds) {
            guildService.get(guildIds.region,guildIds.realm,guildIds.name,function(error,result){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guild',result);
            });
        });

        socket.on('get:guildsCount', function () {
            guildService.getCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guildsCount', count);
            });
        });

        socket.on('get:guildAdsCount', function () {
            guildService.getAdsCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guildAdsCount', count);
            });
        });

        socket.on('update:guild', function (guildIds) {
            guildService.insertOrUpdateUpdate(guildIds.region,guildIds.realm,guildIds.name,function (error, position) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('update:guild', position);
            });
        });


        /**
         * Authenticate Users
         */
        if (socket.request.user.logged_in){
            socket.on('put:guildAd', function(guild) {
                guildService.insertOrUpdateAd(guild.region, guild.realm, guild.name, socket.request.user.id, guild.ad,function(error){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('put:guildAd', guild);
                });
            });
            socket.on('delete:guildAd', function(guild) {
                guildService.deleteAd(guild.region, guild.realm, guild.name,socket.request.user.id,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('delete:guildAd',result);
                });
            });

            socket.on('get:userGuildAds', function() {
                guildService.getUserAds(socket.request.user.id,function(error,result){
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