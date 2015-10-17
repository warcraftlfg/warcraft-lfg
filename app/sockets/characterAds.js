"use strict";
/**
 * Provides function which listen socket.io on character event
 */

//Modules dependencies
var async = require("async");
var CharacterAdModel = process.require("app/models/CharacterAdModel.js");

//Configuration
var characterAdModel = new CharacterAdModel();


module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket) {

        /**
         * All users
         * Return last characters Ads
         */
        socket.on('get:character-ads', function() {
            characterAdModel.getLast(function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:character-ads',result);
            });
        });

        socket.on('get:character-ad', function(characterAd) {
            characterAdModel.get(characterAd,function(error,result){
                if (error){
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:character-ad',result);
            });
        });

        if (socket.request.user.logged_in){
            /**
             * Logged In Users
             * Return last characters Ads
             */
            socket.on('add:character-ad', function(characterAd) {
                characterAdModel.add(socket.request.user.id, characterAd, function (error) {
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    characterAdModel.getLast(function (error, result) {
                        if (error){
                            socket.emit("global:error", error.message);
                            return;
                        }
                        io.emit('get:character-ads', result);
                        socket.emit('add:character-ad', result);
                    });
                });
            });

            socket.on('get:user-character-ads', function(characterAd) {
                characterAdModel.getUserCharacterAds(socket.request.user.id,function(error,result){
                    if (error){
                        socket.emit("global:error", error.message);
                        return;
                    }
                    socket.emit('get:user-character-ads',result);
                });
            });
        }
    });
};
