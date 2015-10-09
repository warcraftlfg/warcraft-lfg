"use strict"
module.exports = function(io){
    io.on('connection', function(socket){
        console.log('user '+ socket.request.user +' connected');
        io.sockets.emit('get:user',socket.request.user);
    });
};