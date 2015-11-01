"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var warcraftLogsAPI = process.require("api/warcraftLogs.js");
var logger = process.require("api/logger.js").get("logger");
var characterUpdateModel = process.require("models/characterUpdateModel.js");
var characterModel = process.require("models/characterModel.js");
var applicationStorage = process.require("api/applicationStorage.js");
var userService = process.require("services/userService.js");
var async = require("async");

module.exports.updateNext = function(callback){
    var self=this;
    characterUpdateModel.getNextToUpdate(function(error,characterUpdate) {
        if (error) {
            logger.error(error.message);
            callback();
            return;
        }
        if (characterUpdate) {
            self.update(characterUpdate.region,characterUpdate.realm,characterUpdate.name, function (error) {
                if (error) {
                    logger.error(error.message);
                }

                callback();
            });
        }
        else{
            callback();
        }
    });
};


module.exports.update = function(region,realm,name,callback) {
    var self = this;
    characterUpdateModel.delete(region,realm,name,function (error) {
        if (error) {
            callback();
            return;
        }
        bnetAPI.getCharacter(region, realm, name, function (error, character) {
            if (error || character.level<100) {
                callback();
                return;
            }
            characterModel.insertOrUpdateBnet(region,character.realm,character.name,character,function (error) {
                if (error) {
                    callback();
                    return;
                }
                logger.info('insert/update character: ' + region + "-" + character.realm + "-" + character.name);

                self.emitCount();

                //Get Wlogs only if character exist
                warcraftLogsAPI.getRankings(region,character.realm,character.name,function (error,warcraftLogs) {
                    if (error) {
                        callback();
                        return;
                    }
                    characterModel.insertOrUpdateWarcraftLogs(region,character.realm,character.name,warcraftLogs,function (error) {
                        if (error) {
                            callback();
                            return;
                        }
                        logger.info('insert/update wlogs for character: ' + region + "-" + character.realm + "-" + character.name);
                        callback();
                    });
                });
            });




        });
    });
};

module.exports.insertOrUpdateUpdate =  function(region,realm,name,callback) {
    characterUpdateModel.insertOrUpdate(region, realm, name, 5, function (error) {
        if (error){
            logger.error(error.message);
            callback(error);
            return;
        }
        characterUpdateModel.getPosition(5,function(error,position){
            if (error){
                logger.error(error.message);
            }
            callback(error,position);
        });
    });
};



module.exports.emitCount = function(){
    //Dispatch count to all users if new
    characterModel.getCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var io = applicationStorage.getSocketIo();
        if(!io)
            var io = require('socket.io-emitter')();
        io.emit('get:charactersCount', count);
    });
};

module.exports.emitAdsCount = function(){
    //Dispatch count to all users if new
    characterModel.getAdsCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var io = applicationStorage.getSocketIo();
        if(!io)
            var io = require('socket.io-emitter')();
        io.emit('get:characterAdsCount', count);
    });
};

module.exports.emitLastAds = function(){
    characterModel.getLastAds(function (error, characterAds) {
        if (error) {
            return;
        }
        var io = applicationStorage.getSocketIo();
        if(!io)
            var io = require('socket.io-emitter')();
        io.emit('get:lastCharacterAds', characterAds);
    });

};



module.exports.insertOrUpdateAd = function(region,realm,name,id,ad,callback){
    var self = this;
    userService.isOwner(id,region,realm,name,function(error,isMyCharacter){
        if(error){
            logger.error(error.message);
            callback(error);
            return;
        }
        if(isMyCharacter){
            characterModel.insertOrUpdateAd(region,realm,name,id,ad,function(error){
                if(error)
                    logger.error(error.message);

                self.emitAdsCount();
                self.emitCount();
                self.emitLastAds();

                characterUpdateModel.insertOrUpdate(region,realm,name,10,function(error){
                    if(error)
                        logger.error(error.message);
                });
                callback(error);
            });
        }
        else {
            error = new Error("CHARACTER_NOT_MEMBER_ERROR");
            logger.error(error.message);
            callback(error);
        }
    });
};


module.exports.setId = function(region,realm,name,id,callback){
    characterModel.setId(region,realm,name,id,function(error){
        if(error)
            logger.error(error.message);
        callback(error);
    });
};



module.exports.getLastAds = function(callback) {
    characterModel.getLastAds(function (error, characters) {
        if (error)
            logger.error(error.message);
        callback(error,characters);

    });
};

module.exports.getAds = function(number,filters,callback) {
    characterModel.getAds(number,filters,function (error, characters) {
        if (error)
            logger.error(error.message);
        callback(error,characters);

    });
};

module.exports.get = function(region,realm,name,callback){
    characterModel.get(region,realm,name,function(error,character){
        if (error)
            logger.error(error.message);
        callback(error,character);
    });
};

module.exports.getCount = function(callback){
    characterModel.getCount(function (error, count) {
        if (error)
            logger.error(error.message);
        callback(error,count);
    });
};

module.exports.getAdsCount = function(callback){
    characterModel.getAdsCount(function (error, count) {
        if (error)
            logger.error(error.message);
        callback(error,count);
    });
};

module.exports.deleteAd = function(region,realm,name,id,callback){
    var self=this;
    characterModel.deleteAd(region,realm,name,id,function(error){
        if (error)
            logger.error(error.message);

        self.emitAdsCount();
        self.emitCount();
        self.emitLastAds();

        callback(error);

    });
};

module.exports.getUserAds = function(id,callback){
    characterModel.getUserAds(id,function(error,ads){
        if (error)
            logger.error(error.message);

        callback(error,ads);
    });
};

module.exports.deleteOldAds = function(callback){
    var timestamp = new Date().getTime();
    var oldTimestamp = timestamp - (30 * 24 * 3600 * 1000);
    characterModel.deleteOldAds(oldTimestamp,function(error){
        if (error){
            logger.error(error.message);
        }
        callback(error);
    });
};