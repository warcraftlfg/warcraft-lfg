"use strict";
/**
 * Provides function which listen socket.io on character event
 */

//Modules dependencies
var async = require("async");
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
            characterModel.getLastAds(5,null,function(error,characters){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }

                socket.emit('get:lastCharacterAds',characters);
            });
        });

        socket.on('get:character', function(characterIds) {
            characterModel.get(characterIds.region,characterIds.realm,characterIds.name,function(error,character){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:character',character);
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
            characterModel.getAdsCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterAdCount', count);
            });
        });

        socket.on('get:characters', function (filters) {
            characterModel.getLastAds(30,filters,function (error, characters) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characters', characters);
            });
        });




        if (socket.request.user.logged_in){
            /**
             * Logged In Users
             * Return last characters Ads
             */
            socket.on('put:characterAd', function(character) {
                characterModel.insertOrUpdateAd(character.region, character.realm, character.name, socket.request.user.id, character.ad, function (error) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    self.emitCharacterAdCount();
                    self.emitLastCharacterAds();
                    socket.emit('put:characterAd', character);
                });
            });

            socket.on('delete:characterAd', function(character) {
                characterModel.deleteAd(character.region,character.realm,character.name,socket.request.user.id,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    self.emitCharacterAdCount();
                    self.emitLastCharacterAds();
                    socket.emit('delete:characterAd',result);
                });
            });

            socket.on('get:userCharacterAds', function() {
                characterModel.getUserCharacterAds(socket.request.user.id,function(error,result){
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
    characterModel.getAdsCount(function (error, count) {
        if (error){
            return;
        }
        io.emit('get:characterAdCount', count);
    });


};

module.exports.emitLastCharacterAds = function() {
    var io = applicationStorage.getSocketIo();
    characterModel.getLastAds(5, null,function (error, characterAds) {
        if (error) {
            return;
        }
        io.emit('get:lastCharacterAds', characterAds);
    });

};
