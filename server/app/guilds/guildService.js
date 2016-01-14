"use strict";

var async = require("async");
var guildModel = process.require("guilds/guildModel.js");
var bnetAPI = process.require("core/api/bnet.js");
var userService = process.require("users/userService.js");

/**
 * Sanitize and set the user's id to the guild
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.sanitizeAndSetId = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            bnetAPI.getGuild(region,realm,name,[],function(error,guild){
                callback(error,guild);
            });
        },
        function(guild,callback){
            guildModel.setId(region,guild.realm,guild.name,id,function(error){
                callback(error,guild);
            });
        }
    ],function(error,guild){
        callback(error,guild);
    });
};

/**
 * Check the User permission and Upsert the Ad
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param ad
 * @param callback
 */
module.exports.checkPermsAndUpsertAd = function(region,realm,name,id,ad,callback){
    async.waterfall([
        function(callback){
            //Sanitize Name
            bnetAPI.getGuild(region,realm,name,[],function(error,guild){
                callback(error,guild);
            });
        },
        function(guild,callback){
            //Check Permission
            userService.hasGuildRankPermission(region,guild.realm,guild.name,id,['ad', 'edit'],function(error, hasPerm) {
                if(hasPerm){
                    callback(error,guild)
                }
                else {
                    callback(new Error("GUILD_ACCESS_DENIED"));
                }
            });
        },
        function(guild,callback) {
            //Upsert Ad
            guildModel.upsertAd(region,guild.realm,guild.name,ad,function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Check perms and delete Ad
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.checkPermsAndDeleteAd  = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            //Sanitize Name
            bnetAPI.getGuild(region,realm,name,[],function(error,guild){
                callback(error,guild);
            });
        },
        function(guild,callback){
            //Check Permission
            userService.hasGuildRankPermission(region,guild.realm,guild.name,id,['ad', 'edit'],function(error, hasPerm) {
                if(hasPerm){
                    callback(error,guild)
                }
                else {
                    callback(new Error("GUILD_ACCESS_DENIED"));
                }
            });
        },
        function(guild,callback) {
            //Upsert Ad
            guildModel.deleteAd(region,guild.realm,guild.name,function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Check the User permission and Upsert the perms
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param ad
 * @param callback
 */
module.exports.checkPermsAndUpsertPerms = function(region,realm,name,id,perms,callback){
    async.waterfall([
        function(callback){
            //Sanitize Name
            bnetAPI.getGuild(region,realm,name,[],function(error,guild){
                callback(error,guild);
            });
        },
        function(guild,callback){
            //Check if user is GM
            userService.getGuildRank(region,guild.realm,guild.name,id,function(error,rank){
                if(rank === 0) {
                    callback(error, guild)
                } else {
                    callback(new Error("GUILD_ACCESS_DENIED"));
                }
            });
        },
        function(guild,callback) {
            //Upsert Ad
            guildModel.upsertPerms(region,guild.realm,guild.name,perms,function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};
