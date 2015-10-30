"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildModel = process.require("models/guildModel.js");
var applicationStorage = process.require("api/applicationStorage.js");
var characterUpdateModel =  process.require("models/characterUpdateModel.js");
var userService = process.require("services/userService.js");
var async = require("async");

module.exports.updateNext = function(callback){
    var self=this;
    guildUpdateModel.getNextToUpdate(function(error,guildUpdate) {
        if (error) {
            callback(error);
            return;
        }
        if (guildUpdate) {
            self.update(guildUpdate.region,guildUpdate.realm,guildUpdate.name, function (error,guild) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null,guild);
            });
        }
        else
            callback();

    });
};

module.exports.update = function(region,realm,name,callback){
    var self=this;
    guildUpdateModel.delete(region,realm,name,function (error) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getGuild(region, realm, name, function (error,guild) {
            if (error) {
                callback();
                return;
            }

            guildModel.insertOrUpdateBnet(region,guild.realm,guild.name,guild,function (error,result){
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update guild: ' + region + "-" + guild.realm + "-" + guild.name);
                callback(null,guild);

                self.emitCount();

                guild.members.forEach(function (member){
                    characterUpdateModel.insertOrUpdate(region,member.character.realm,member.character.name,0,function(error){
                        if (error) {
                            logger.error(error.message);
                            return;
                        }
                        logger.info("Insert character to update "+ region +"-"+member.character.realm+"-"+member.character.name);
                    });
                });

            });
        });
    });
};

module.exports.getCount = function(callback){
    guildModel.getCount(function(error,count){
        callback(error,count);
    });
};

module.exports.insertOrUpdateUpdate =  function(region,realm,name,callback) {
    guildUpdateModel.insertOrUpdate(region, realm, name, 5, function (error) {
        if (error){
            logger.error(error.message);
            callback(error);
            return;
        }
        guildUpdateModel.getPosition(5,function(error,position){
            if (error){
                logger.error(error.message);
            }
            callback(error,position);
        });
    });
};


module.exports.emitCount = function(){
    guildModel.getCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var io = applicationStorage.getSocketIo();
        //If socketIo undefined try io-emitter (for cron)
        if(!io)
            var io = require('socket.io-emitter')();
        io.emit('get:guildsCount', count);
    });
};

module.exports.emitAdsCount = function(){
    //Dispatch count to all users if new
    guildModel.getAdsCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var io = applicationStorage.getSocketIo();
        if(!io)
            var io = require('socket.io-emitter')();
        io.emit('get:guildAdsCount', count);
    });
};

module.exports.emitLastAds = function(){
    guildModel.getLastAds(function (error, characterAds) {
        if (error) {
            return;
        }
        var io = applicationStorage.getSocketIo();
        if(!io)
            var io = require('socket.io-emitter')();
        io.emit('get:lastGuildAds', characterAds);
    });

};


module.exports.insertOrUpdateAd = function(region,realm,name,id,ad,callback){
    var self=this;
    userService.isMember(id,region,realm,name,function(error,isMyGuild) {
        if (isMyGuild) {
            guildModel.insertOrUpdateAd(region,realm,name,id,ad,function(error,result){
                if(error){
                    callback(error);
                    return;
                }

                self.emitAdsCount();
                self.emitCount();
                self.emitLastAds();

                callback(error,result);
            });
        }
        else {
            //Remove user from guild (gquit / gkick)
            guildModel.removeId(region,realm,name,id, function (error) {
                if (error)
                    logger.error(error.message);
                callback(new Error("GUILD_NOT_MEMBER_ERROR"));
            });
        }
    });
};


module.exports.setId = function(region,realm,name,id,callback){
    guildModel.setId(region,realm,name,id,function(error){
        if(error)
            logger.error(error.message);
        callback(error);
    });
};


module.exports.getLastAds = function(callback) {
    guildModel.getLastAds(function (error, characters) {
        if (error)
            logger.error(error.message);
        callback(error,characters);

    });
};

module.exports.getAds = function(number,filters,callback) {
    guildModel.getAds(number,filters,function (error, characters) {
        if (error)
            logger.error(error.message);
        callback(error,characters);

    });
};

module.exports.get = function(region,realm,name,callback){
    guildModel.get(region,realm,name,function(error,character){
        if (error)
            logger.error(error.message);
        callback(error,character);
    });
};

module.exports.getCount = function(callback){
    guildModel.getCount(function (error, count) {
        if (error)
            logger.error(error.message);
        callback(error,count);
    });
};

module.exports.getAdsCount = function(callback){
    guildModel.getAdsCount(function (error, count) {
        if (error)
            logger.error(error.message);
        callback(error,count);
    });
};

module.exports.deleteAd = function(region,realm,name,id,callback){
    var self=this;
    guildModel.deleteAd(region,realm,name,id,function(error){
        if (error)
            logger.error(error.message);

        self.emitAdsCount();
        self.emitCount();
        self.emitLastAds();

        callback(error);

    });
};

module.exports.getUserAds = function(id,callback){
    guildModel.getUserAds(id,function(error,ads){
        if (error)
            logger.error(error.message);

        callback(error,ads);
    });
}