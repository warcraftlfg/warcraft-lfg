"use strict"

/**
 * Application storage is a global storage to be
 * able to share information between modules
 */

var mongoDatabase;
var redisDatabase;
var socketIo;


module.exports.getMongoDatabase = function(){
    return mongoDatabase;
};

module.exports.setMongoDatabase = function(newDatabase){
    mongoDatabase = newDatabase;
};

module.exports.getRedisDatabase = function(){
    return redisDatabase;
};

module.exports.setRedisDatabase = function(newDatabase){
    redisDatabase = newDatabase;
};

module.exports.getSocketIo = function(){
    return socketIo;
};

module.exports.setSocketIo = function(newsocketIo){
    socketIo = newsocketIo;
};
