"use strict";
/**
 * Provides function which listen socket.io on character event
 */

//Modules dependencies
var async = require("async");
var characterAdModel = process.require("models/characterAdModel.js");
var characterModel = process.require("models/characterModel.js");
var characterService = process.require("services/characterService.js");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();
    var self=this;
    //Listen for new user's connections
    io.on('connection', function(socket) {

        /**
         * All users
         * Return last characters Ads
         */
        socket.on('get:lastCharacterAds', function() {
            characterAdModel.getLast(5,function(error,characterAds){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:lastCharacterAds',characterAds);
            });
        });

        socket.on('get:characterData', function(characterData) {
            characterService.getCharacterData(characterData,function(error,characterData){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterData',characterData);
            });
        });

        socket.on('get:characterAd', function(characterAd) {
            characterAdModel.get(characterAd,function(error,characterAd){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterAd',characterAd);
            });
        });

        socket.on('get:characterCount', function () {
            characterModel.getCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterCount', count);
            });
        });

        socket.on('get:characterAdCount', function () {
            characterAdModel.getCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterAdCount', count);
            });
        });

        socket.on('get:charactersData', function (recruit) {
            characterService.getCharactersData(recruit,function (error, charactersData) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:charactersData', charactersData);
            });
        });




        if (socket.request.user.logged_in){
            /**
             * Logged In Users
             * Return last characters Ads
             */
            socket.on('put:characterAd', function(characterAd) {
                characterAdModel.insertOrUpdate(socket.request.user.id, characterAd, function (error) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    self.emitCharacterAdCount();
                    self.emitLastCharacterAds();
                    socket.emit('put:characterAd', characterAd);
                });
            });

            socket.on('delete:characterAd', function(characterAd) {
                characterAdModel.delete(socket.request.user.id,characterAd,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    self.emitCharacterAdCount();
                    self.emitLastCharacterAds();
                    socket.emit('delete:characterAd',result);
                });
            });

            socket.on('get:userCharacterAds', function(characterAd) {
                characterAdModel.getUserCharacterAds(socket.request.user.id,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('get:userCharacterAds',result);
                });
            });
        }
    });
};

module.exports.emitCharacterAdCount = function(){
    var io = applicationStorage.getSocketIo();
    characterAdModel.getCount(function (error, count) {
        if (error){
            return;
        }
        io.emit('get:characterAdCount', count);
    });


};

module.exports.emitLastCharacterAds = function() {
    var io = applicationStorage.getSocketIo();
    characterAdModel.getLast(5, function (error, characterAds) {
        if (error) {
            return;
        }
        io.emit('get:lastCharacterAds', characterAds);
    });

};
