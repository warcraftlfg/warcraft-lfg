"use strict";
/**
 * Provides function which listen socket.io on character event
 */

//Modules dependencies
var async = require("async");
var characterService = process.require("services/characterService.js");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();
    //Listen for new user's connections
    io.on('connection', function(socket) {

        /**
         * All users
         * Return last characters Ads
         */
        socket.on('get:lastCharacterAds', function() {
            characterService.getLastAds(function(error,characters){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:lastCharacterAds',characters);
            });
        });

        socket.on('get:character', function(characterIds) {
            characterService.get(characterIds.region,characterIds.realm,characterIds.name,function(error,character){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:character',character);
            });
        });

        socket.on('get:charactersCount', function () {
            characterService.getCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:charactersCount', count);
            });
        });

        socket.on('get:characterAdsCount', function () {
            characterService.getAdsCount(function (error, count) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterAdsCount', count);
            });
        });

        socket.on('get:characterAds', function (filters) {
            characterService.getAds(30,filters,function (error, characters) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterAds', characters);
            });
        });

        socket.on('update:character', function (characterIds) {
            characterService.insertOrUpdateUpdate(characterIds.region,characterIds.realm,characterIds.name,function (error, position) {
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('update:character', position);
            });
        });


        if (socket.request.user.logged_in){
            /**
             * Logged In Users
             * Return last characters Ads
             */
            socket.on('put:characterAd', function(character) {
                characterService.insertOrUpdateAd(character.region, character.realm, character.name, socket.request.user.id, character.ad, function (error) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('put:characterAd', character);
                });
            });

            socket.on('delete:characterAd', function(character) {
                characterService.deleteAd(character.region,character.realm,character.name,socket.request.user.id,function(error){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('delete:characterAd');
                });
            });

            socket.on('get:userCharacterAds', function() {
                characterService.getUserAds(socket.request.user.id,function(error,characterAds){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('get:userCharacterAds',characterAds);
                });
            });
        }
    });
};
