var applicationStorage = process.require("core/applicationStorage.js");
var config = process.require("config/config.json");
var lodash = require("lodash");


module.exports.connect = function () {
    var logger = applicationStorage.logger;
    applicationStorage.socketIo.on('connection', function (socket) {
        if (socket.request.user.logged_in == true) {
            logger.info("%s User %s connected", socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress, socket.request.user.battleTag);
            if (applicationStorage.users[socket.request.user.id]) {
                applicationStorage.users[socket.request.user.id].push(socket.id);
            } else {
                applicationStorage.users[socket.request.user.id] = [socket.id];
            }
        } else {
            logger.info("%s User anonymous connected", socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress);
        }
        socket.on('disconnect', function () {
            if (socket.request.user.logged_in == true) {
                logger.info("%s User %s disconnected",  socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress,socket.request.user.battleTag);
                lodash.remove(applicationStorage.users[socket.request.user.id], function (socketId) {
                    return socketId == socket.id
                });
            } else {
                logger.info("%s User anonymous disconnected",socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress);
            }
        });


    });

};