"use strict";

//Modules dependencies
var async = require("async");
var guildService = process.require("services/guildService.js");
var userService = process.require("services/userService.js");
var applicationStorage = process.require("api/applicationStorage.js");


//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");

module.exports.connect = function(){
    var io = applicationStorage.socketIo;

    io.on('connection', function(socket) {

        /**
         * All users functions
         */
        socket.on('get:lastGuildAds', function() {
            logger.debug('get:lastGuildAds',socket.request.user);

            guildService.getLastAds(function(error,guildAds){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:lastGuildAds',guildAds);
            });
        });

        socket.on('get:guild', function(guildIds) {
            logger.debug('get:guild',socket.request.user);

            guildService.get(guildIds.region,guildIds.realm,guildIds.name,function(error,result){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:guild',result);
            });
        });

        socket.on('get:guildsCount', function () {
            logger.debug('get:guildsCount',socket.request.user);

            guildService.getCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:guildsCount', count);
            });
        });

        socket.on('get:guildAdsCount', function () {
            logger.debug('get:guildAdsCount',socket.request.user);

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
            logger.debug('update:guild',socket.request.user);

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
                logger.debug('put:guildAd',socket.request.user);

                guildService.insertOrUpdateAd(guild.region, guild.realm, guild.name, socket.request.user.id, guild.ad,function(error){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('put:guildAd', guild);
                });
            });

            socket.on('put:guildPerms', function(guild) {
                logger.debug('put:guildPerms',socket.request.user);

                guildService.insertOrUpdatePerms(guild.region, guild.realm, guild.name, socket.request.user.id, guild.perms,function(error){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('put:guildPerms', guild);
                });
            });

            socket.on('delete:guildAd', function(guild) {
                logger.debug('delete:guildAd',socket.request.user);

                guildService.deleteAd(guild.region, guild.realm, guild.name,socket.request.user.id,function(error,result){
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('delete:guildAd',result);
                });
            });

            socket.on('get:userGuildAds', function() {
                logger.debug('get:userGuildAds',socket.request.user);

                guildService.getUserAds(socket.request.user.id,function(error,result){
                    if (error)
                        return socket.emit("global:error", error.message);
                    async.each(result, function(guild, callback) {
                        userService.getGuildRank(socket.request.user.id,guild.region,guild.realm,guild.name,function(error,rank){
                            guild.rank = rank;
                            callback(error);
                        });
                    }, function (error) {
                        if (error)
                            return socket.emit("global:error", error.message);
                        socket.emit('get:userGuildAds',result);
                    });
                });
            });
        }
    });
};