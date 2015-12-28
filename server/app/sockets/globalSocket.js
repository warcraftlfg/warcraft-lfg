"use strict";

//Modules dependencies
var searchService = process.require("services/searchService.js");
var realmService = process.require("services/realmService.js");
var logger = process.require("api/logger.js").get("logger");
var applicationStorage = process.require("api/applicationStorage.js");


//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");

module.exports.connect = function(){
    var io = applicationStorage.socketIo;

    io.on('connection', function(socket) {
        socket.on('get:search', function(search) {
            logger.debug('get:search',socket.request.user);

            searchService.searchGuildsAndCharacters(search,function(error,result){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:search',result);
            });
        });

        socket.on('get:realms', function(realmZones) {
            logger.debug('get:realms',socket.request.user);

            realmService.getFromRealmZones(realmZones,function(error,result){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:realms',result);
            });
        });

    });


};

