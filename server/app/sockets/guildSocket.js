"use strict";
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var async = require("async");
var guildModel = process.require("models/guildModel.js");
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
            guildModel.getLastAds(5,function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:lastGuildAds',result);
            });
        });

        socket.on('get:guild', function(characterIds) {
            guildModel.get(characterIds.region,characterIds.realm,characterIds.name,function(error,result){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guild',result);
            });
        });

        socket.on('get:guildCount', function () {
            guildModel.getCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guildCount', count);
            });
        });

        socket.on('get:guildAdCount', function () {
            guildModel.getAdsCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:guildAdCount', count);
            });
        });


        /**
         * Authenticate Users
         */
        if (socket.request.user.logged_in){
            socket.on('put:guildAd', function(guild) {
                guildModel.insertOrUpdateAd(guild.region, guild.realm, guild.name, socket.request.user.id, guild.ad,function(error,guild){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    self.emitLastGuildAds();
                    self.emitGuildAdCount();
                    socket.emit('put:guildAd', guild);
                });
            });
            socket.on('delete:guildAd', function(guildAd) {
                guildModel.deleteAd(socket.request.user.id,guildAd,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('delete:guildAd',result);
                    self.emitGuildAdCount();
                    self.emitLastGuildAds();
                });
            });

            socket.on('get:userGuildAds', function() {
                guildModel.getUserGuildAds(socket.request.user.id,function(error,result){
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

module.exports.emitGuildAdCount = function(){
    var io = applicationStorage.getSocketIo();
    guildModel.getCount(function (error, count) {
        if (error){
            return;
        }
        io.emit('get:guildAdCount', count);
    });


};

module.exports.emitLastGuildAds = function(){
    var io = applicationStorage.getSocketIo();
    guildModel.getLast(5,function (error, guildAds) {
        if (error){
            return;
        }
        io.emit('get:lastGuildAds', guildAds);
    });

};


