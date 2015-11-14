"use strict"


/**
 * Provides function which listen socket.io and give global informations.
 */

//Modules dependencies
var searchService = process.require("services/searchService.js");
var logger = process.require("api/logger.js").get("logger");
var applicationStorage = process.require("api/applicationStorage.js");


module.exports.connect = function(){
    var io = applicationStorage.getSocketIo();
    var self=this;
    //Listen for new user's connections
    io.on('connection', function(socket) {

        socket.on('get:search', function(search) {
            searchService.searchGuildsAndCharacters(search,function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                socket.emit('get:search',result);
            });
        });

        socket.on('get:realmSearch', function(search) {
            searchService.searchRealms(search,function(error,result){
                if (error) {
                    socket.emit("global:error", error.message);
                    return;
                }
                console.log('ici');
                socket.emit('get:realmSearch',result);
            });
        });
    });
}

