var applicationStorage = process.require("core/applicationStorage.js");
var config = process.require("config/config.json");
var lodash = require("lodash");


module.exports.connect = function () {
    var logger = applicationStorage.logger;
    applicationStorage.socketIo.on('connection', function (socket) {
        if (socket.request.user.logged_in == true) {
            logger.info("User %s connected", socket.request.user.battleTag);
            if (applicationStorage.users[socket.request.user.id]) {
                applicationStorage.users[socket.request.user.id].push(socket.id);
            } else {
                applicationStorage.users[socket.request.user.id] = [socket.id];
            }
        } else {
            logger.info("User anonymous connected");
        }
        socket.on('disconnect', function () {
            if (socket.request.user.logged_in == true) {
                logger.info("User %s disconnected", socket.request.user.battleTag);
                lodash.remove(applicationStorage.users[socket.request.user.id],function(socketId){return socketId == socket.id});
            } else {
                logger.info("User anonymous disconnected");
            }
        });



    });

};