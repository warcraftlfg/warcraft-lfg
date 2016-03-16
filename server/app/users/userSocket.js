var applicationStorage = process.require("core/applicationStorage.js");

module.exports.connect = function() {
    var io = applicationStorage.socketIo;
    var logger = applicationStorage.logger;

    io.on('connection', function(socket) {
        applicationStorage.users[socket.request.user.id]=socket.id;
    });
};