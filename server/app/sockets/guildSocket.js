"use strict";
/**
 * Provides function which listen socket.io on guild event
 */

//Modules dependencies
var async = require("async");
var guildAdModel = process.require("models/guildAdModel.js");
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
            guildAdModel.getLast(5,function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:lastGuildAds',result);
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
            guildAdModel.getCount(function (error, count) {
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
            socket.on('put:guildAd', function(guildAd) {
                guildAdModel.insertOrUpdate(socket.request.user.id,guildAd,function(error,guildAd){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    self.emitLastGuildAds();
                    self.emitGuildAdCount();
                    socket.emit('put:guildAd', guildAd);
                });
            });
            socket.on('delete:guildAd', function(guildAd) {
                guildAdModel.delete(socket.request.user.id,guildAd,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('delete:guildAd',result);
                    self.emitGuildAdCount();
                    self.emitLastGuildAds();
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

module.exports.emitGuildAdCount = function(){
    var io = applicationStorage.getSocketIo();
    guildAdModel.getCount(function (error, count) {
        if (error){
            return;
        }
        io.emit('get:guildAdCount', count);
    });


};

module.exports.emitLastGuildAds = function(){
    var io = applicationStorage.getSocketIo();
    guildAdModel.getLast(5,function (error, guildAds) {
        if (error){
            return;
        }
        io.emit('get:lastGuildAds', guildAds);
    });

};


