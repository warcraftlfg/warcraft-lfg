"use strict"
module.exports = function(io){
    io.on('connection', function(socket){
        console.log( socket.request.user.battletag + " is connected");
        socket.emit('get:user',socket.request.user);
    });
};