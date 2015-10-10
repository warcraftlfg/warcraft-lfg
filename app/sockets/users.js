"use strict"


/**
 * Provides function which listen socket.io and give user informations.
 */

//Modules dependencies
var logger = process.require("app/api/logger.js").get("wow-guild-recruitment");


module.exports = function(io){
    //Listen for new user's connections
    io.on('connection', function(socket){

        if(socket.request.user.logged_in)
            logger.info( socket.request.user.battletag + " connected");
        else
            logger.info("Anonymous user connected");

        //Send to user is informations
        socket.emit('get:user',socket.request.user);
    });
};