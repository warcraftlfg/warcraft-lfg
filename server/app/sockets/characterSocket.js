"use strict";

//Modules dependencies
var async = require("async");
var characterService = process.require("services/characterService.js");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();

    io.on('connection', function(socket) {

        /**
         * All users functions
         */
        socket.on('get:lastCharacterAds', function() {
            characterService.getLastAds(function(error,characters){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:lastCharacterAds',characters);
            });
        });

        socket.on('get:character', function(characterIds) {
            characterService.get(characterIds.region,characterIds.realm,characterIds.name,function(error,character){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:character',character);
            });
        });

        socket.on('get:charactersCount', function () {
            characterService.getCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:charactersCount', count);
            });
        });

        socket.on('get:characterAdsCount', function () {
            characterService.getAdsCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:characterAdsCount', count);
            });
        });

        socket.on('get:characterAds', function (filters, last) {
            filters.last = last;
            characterService.getAds(7,filters,function (error, characters) {
                if (error) {
                    return socket.emit("global:error", error.message);
                }
                socket.emit('get:characterAds', characters, last);
            });
        });

        socket.on('update:character', function (characterIds) {
            characterService.insertOrUpdateUpdate(characterIds.region,characterIds.realm,characterIds.name,function (error, position) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('update:character', position);
            });
        });

        /**
         * Authenticated user functions
         */
        if (socket.request.user.logged_in){
            socket.on('put:characterAd', function(character) {
                characterService.insertOrUpdateAd(character.region, character.realm, character.name, socket.request.user.id, character.ad, function (error) {
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('put:characterAd', character);
                });
            });

            socket.on('delete:characterAd', function(character) {
                characterService.deleteAd(character.region,character.realm,character.name,socket.request.user.id,function(error){
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('delete:characterAd');
                });
            });

            socket.on('get:userCharacterAds', function() {
                characterService.getUserAds(socket.request.user.id,function(error,characterAds){
                    if (error)
                        socket.emit("global:error", error.message);
                    socket.emit('get:userCharacterAds',characterAds);
                });
            });
        }
    });
};
