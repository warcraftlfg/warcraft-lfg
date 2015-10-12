"use strict"


/**
 * Provides function which listen socket.io and give user informations.
 */

//Modules dependencies
var loggerWebserver = process.require("app/api/logger.js").get("webserver");


module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket){

        if(socket.request.user.logged_in)
            loggerWebserver.info( socket.request.user.battletag + " connected");
        else
            loggerWebserver.info("Anonymous user connected");

        //Send to user is informations
        socket.emit('get:user',socket.request.user);
    });
};