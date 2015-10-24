"use strict";
/**
 * Provides function which listen socket.io on character event
 */

//Modules dependencies
var async = require("async");
var characterAdModel = process.require("models/CharacterAdModel.js");


module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket) {

        /**
         * All users
         * Return last characters Ads
         */
        socket.on('get:characterAds', function() {
            characterAdModel.getLast(function(error,characterAds){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:characterAds',characterAds);
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
                    characterAdModel.getLast(function (error, result) {
                        if (error){
                            socket.emit("global:error", error.message);
                            return;
                        }
                        io.emit('get:characterAds', result);
                        socket.emit('put:characterAd', characterAd);
                    });
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
