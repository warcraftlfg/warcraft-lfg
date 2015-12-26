"use strict";

//Modules dependencies
var async = require("async");
var guildService = process.require("services/guildService.js");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();

    io.on('connection', function(socket) {

        /**
         * All users functions
         */
        socket.on('get:lastGuildAds', function() {
            guildService.getLastAds(function(error,guildAds){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:lastGuildAds',guildAds);
            });
        });

        socket.on('get:guild', function(guildIds) {
            guildService.get(guildIds.region,guildIds.realm,guildIds.name,function(error,result){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:guild',result);
            });
        });

        socket.on('get:guildsCount', function () {
            guildService.getCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:guildsCount', count);
            });
        });

        socket.on('get:guildAdsCount', function () {
            guildService.getAdsCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:guildAdsCount', count);
            });
        });

        socket.on('get:guildAds', function (filters, last) {
            if (last) {
                    filters.last = last;
            }
            guildService.getAds(7,filters,function (error, guilds) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:guildAds', guilds, last);
            });
        });

        socket.on('update:guild', function (guildIds) {
            guildService.insertOrUpdateUpdate(guildIds.region,guildIds.realm,guildIds.name,function (error, position) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('update:guild', position);
            });
        });

        /**
         * Authenticated user functions
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
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('delete:guildAd',result);
                });
            });

            socket.on('get:userGuildAds', function() {
                guildService.getUserAds(socket.request.user.id,function(error,result){
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('get:userGuildAds',result);
                });
            });
        }
    });
};