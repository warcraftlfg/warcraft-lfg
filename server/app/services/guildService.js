"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var wowProgressAPI = process.require("api/wowProgress.js");
var logger = process.require("api/logger.js").get("logger");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var guildModel = process.require("models/guildModel.js");
var guildKillModel = process.require("models/guildKillModel.js");
var applicationStorage = process.require("api/applicationStorage.js");
var characterUpdateModel =  process.require("models/characterUpdateModel.js");
var userService = process.require("services/userService.js");
var realmService = process.require("services/realmService.js")
var async = require("async");

module.exports.updateNext = function(callback){
    var self=this;
    guildUpdateModel.getNextToUpdate(function(error,guildUpdate) {
        if (error) {
            logger.error(error.message);
            return callback(error);
        }
        if (guildUpdate) {
            //Get Guild Update Result (json or key)
            if(guildUpdate.region && guildUpdate.realm && guildUpdate.name) {
                logger.info("Update Guild "+guildUpdate.region+"-"+guildUpdate.realm+"-"+guildUpdate.name);
                self.update(guildUpdate.region, guildUpdate.realm, guildUpdate.name,guildUpdate.priority, function (error, guild) {
                    if(error && error.message == "BNET_API_ERROR_DENY") {
                        //Bnet API DENY reset the guildUpdateModel for after
                        guildUpdateModel.insertOrUpdate(guildUpdate.region,guildUpdate.realm,guildUpdate.name,guildUpdate.priority,function(error){
                            if(error) {
                                logger.error(error.message);
                                return callback();
                            }
                            logger.warn("Bnet Api Deny ... waiting 1 min");
                            return setTimeout(function () {
                                callback();
                            }, 60000);
                        });
                    }
                    else
                        callback();
                });
            }
            else{
                //Guild Update is already parse before
                callback();
            }
        }
        else{
            //Guild Update is empty
            logger.info("No guildUpdate ... waiting 3 sec");
            setTimeout(function() {
                callback();
            }, 3000);
        }
    });
};

module.exports.update = function(region,realm,name,priority,callback){
    var self=this;

    bnetAPI.getGuild(region, realm, name, function (error,guild) {
        if (error) {
            return callback(error);
        }

        guildModel.insertOrUpdateBnet(region, guild.realm, guild.name, guild, function (error) {
            if (error) {
                return callback(error);
            }

            logger.info('insert/update guild bnet ' + region + "-" + guild.realm + "-" + guild.name);
            self.emitCount();

            async.eachSeries(guild.members, function(member,callback) {
                //if(member.character.level >= 100) {
                characterUpdateModel.insertOrUpdate(region, member.character.realm, member.character.name, priority<=5?priority:3, function (error) {
                    if (error) {
                        return callback(error);
                    }
                    callback();
                    logger.info("Insert character to update " + region + "-" + member.character.realm + "-" + member.character.name);
                });
                /*}
                 else{
                 callback();
                 }*/
            }, function done() {
                wowProgressAPI.getGuildProgress(region,guild.realm, guild.name ,function(error, wowProgressRanking) {
                    if (error) {
                        return callback(error);
                    }

                    if (!wowProgressRanking) {
                        return callback();
                    }

                    async.eachSeries(wowProgressRanking, function(progress, callback) {
                        guildKillModel.insertOrUpdateWoWProgress(progress.region, progress.realm, progress.name, "Hellfire Citadel", progress.boss,progress.bossWeight, progress.difficulty, progress.timestamp, progress.source, function(error) {
                            if (error) {
                                console.log(error);
                                return callback(error);
                            }
                            callback();
                            logger.info("Insert wowprogress kill "+progress.boss +" - "+progress.difficulty);
                        });
                    }, function done() {
                        wowProgressAPI.getGuildRank(region,guild.realm, guild.name ,function(error, wowProgress) {
                            if (error) {
                                return callback(error);
                            }

                            if (!wowProgress) {
                                return callback();
                            }

                            guildModel.insertOrUpdateWowProgress(region,guild.realm,guild.name,wowProgress,function (error) {
                                if (error) {
                                    return callback(error);
                                }

                                logger.info("insert/update guild wowprogress "  + region + "-" +guild.realm +'-'+ guild.name);
                                callback();
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports.getCount = function(callback) {
    guildModel.getCount(function(error,count) {
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
    userService.hasGuildRankPermission(id,region,realm,name,['ad', 'edit'],function(error, hasPerm) {
        if (hasPerm) {
            bnetAPI.getGuild(region,realm,name,function(error,guild){
                if(error)
                    return callback(error);
                guildModel.insertOrUpdateAd(region,guild.realm,guild.name,id,ad,function(error,result){
                    if(error){
                        callback(error);
                        return;
                    }

                    self.emitAdsCount();
                    self.emitCount();
                    self.emitLastAds();

                    callback(error,result);
                });
            });
        } else {
            callback(new Error("GUILD_NOT_OFFICER_ERROR"));
        }
    });
};


module.exports.insertOrUpdatePerms = function(region,realm,name,id,perms,callback){
    userService.getGuildRank(id,region,realm,name,function(error,rank) {
        if (rank === 0) {
            guildModel.insertOrUpdatePerms(region,realm,name,id,perms,function(error,result){
                callback(error,result);
            });
        }
        else {
            callback(new Error("GUILD_NOT_LEADER_ERROR"));
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
    async.waterfall([
        function(callback){
            async.waterfall([
                function(callback){
                    if(filters.realmZones && filters.realmZones && filters.realmZones.length>0){
                        filters.realmList = [];
                        realmService.getFromRealmZones(filters.realmZones,function(error,realms){
                            filters.realmList = realms;
                            callback();
                        });
                    }
                    else
                        callback()
                },
                function(callback){
                    if(filters.realm && filters.realm.region && filters.realm.name ){
                        filters.realmList = [];
                        realmService.get(filters.realm.region,filters.realm.name,function(error,realm){
                            if(!realm)
                                return callback();
                            async.forEach(realm.connected_realms,function(name,callback){
                                filters.realmList.push({name:name,region:filters.realm.region});
                                callback();

                            },function(){
                                callback();
                            })
                        });
                    }
                    else
                        callback();
                }
            ],function(){
                callback();
            });
        },
        function(callback){
            guildModel.getAds(number,filters,function (error, guilds) {
                if (error)
                    logger.error(error.message);
                callback(error,guilds);
            });
        }
    ],function(error,guilds){
        callback(error,guilds)
    });
};

module.exports.get = function(region,realm,name,callback){
    guildModel.get(region,realm,name,function(error,guild){
        if (error)
            logger.error(error.message);
        callback(error, guild);
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
    userService.hasGuildRankPermission(id,region,realm,name,['ad', 'del'],function(error, hasPerm) {
        if(hasPerm)
            guildModel.deleteAd(region, realm, name, id, function (error) {
                if (error)
                    logger.error(error.message);

                self.emitAdsCount();
                self.emitCount();
                self.emitLastAds();

                callback(error);
            });
        else {
            callback(new Error("GUILD_NOT_OFFICER_ERROR"));
        }
    });
};

module.exports.getUserAds = function(id,callback){
    guildModel.getUserAds(id,function(error,ads){
        if (error)
            logger.error(error.message);

        callback(error,ads);
    });
};

module.exports.deleteOldAds = function(callback){
    var timestamp = new Date().getTime();
    var oldTimestamp = timestamp - (30 * 24 * 3600 * 1000);
    guildModel.deleteOldAds(oldTimestamp,function(error){
        if (error){
            logger.error(error.message);
        }
        callback(error);
    });
};

module.exports.setAdsToUpdate = function(callback){

    guildModel.getAds(-1,null,function(error,guilds){
        if(error){
            logger.error(error.message);
            return callback(error);
        }
        async.eachSeries(guilds,function(guild,callback){
            guildUpdateModel.insertOrUpdate(guild.region,guild.realm,guild.name,3,function(error){
                if(error)
                    logger.error(error.message);
                logger.info("Insert guild to update " + guild.region + "-" + guild.realm + "-" + guild.name + ' priority 3');
                callback(error);
            });
        });
    });

};