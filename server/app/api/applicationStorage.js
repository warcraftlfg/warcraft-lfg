"use strict"

/**
 * Application storage is a global storage to be
 * able to share information between modules
 */


var socketIo;




module.exports.getSocketIo = function(){
    return socketIo;
};

module.exports.setSocketIo = function(newsocketIo){
    socketIo = newsocketIo;
};
