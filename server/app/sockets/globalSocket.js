"use strict";

//Modules dependencies
var searchService = process.require("services/searchService.js");
var logger = process.require("api/logger.js").get("logger");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();

    io.on('connection', function(socket) {
        socket.on('get:search', function(search) {
            searchService.searchGuildsAndCharacters(search,function(error,result){
                if (error)
                    return socket.emit("global:error", error.message);
                socket.emit('get:search',result);
            });
        });
    });
};

