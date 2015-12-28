"use strict";

//Modules dependencies
var async = require("async");
var characterService = process.require("services/characterService.js");
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
        socket.on('get:lastCharacterAds', function() {
            logger.debug('get:lastCharacterAds',socket.request.user);
            characterService.getLastAds(function(error,characters){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:lastCharacterAds',characters);
            });
        });

        socket.on('get:character', function(characterIds) {
            logger.debug('get:character',socket.request.user);

            characterService.get(characterIds.region,characterIds.realm,characterIds.name,function(error,character){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:character',character);
            });
        });

        socket.on('get:charactersCount', function () {
            logger.debug('get:charactersCount',socket.request.user);

            characterService.getCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:charactersCount', count);
            });
        });

        socket.on('get:characterAdsCount', function () {
            logger.debug('get:characterAdsCount',socket.request.user);

            characterService.getAdsCount(function (error, count) {
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:characterAdsCount', count);
            });
        });

        socket.on('get:characterAds', function (filters, last) {
            if (last) {
                    filters.last = last;
            }
            characterService.getAds(7,filters,function (error, characters) {
                if (error) {
                    return socket.emit("global:error", error.message);
                }
                socket.emit('get:characterAds', characters, last);
            });
        });

        socket.on('get:characterBattleTag', function (characterId) {
            characterService.getBattleTag(characterId,function(error,battleTag){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:characterBattleTag', battleTag);
            });
        });

        socket.on('update:character', function (characterIds) {
            logger.debug('update:character',socket.request.user);

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
                logger.debug('put:characterAd',socket.request.user);

                characterService.insertOrUpdateAd(character.region, character.realm, character.name, socket.request.user.id, character.ad, function (error) {
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('put:characterAd', character);
                });
            });

            socket.on('delete:characterAd', function(character) {
                logger.debug('delete:characterAd',socket.request.user);

                characterService.deleteAd(character.region,character.realm,character.name,socket.request.user.id,function(error){
                    if (error)
                        return socket.emit("global:error", error.message);
                    socket.emit('delete:characterAd');
                });
            });

            socket.on('get:userCharacterAds', function() {
                logger.debug('get:userCharacterAds',socket.request.user);

                characterService.getUserAds(socket.request.user.id,function(error,characterAds){
                    if (error)
                        socket.emit("global:error", error.message);
                    socket.emit('get:userCharacterAds',characterAds);
                });
            });
        }
    });
};
