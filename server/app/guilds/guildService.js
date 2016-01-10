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
module.exports.setId = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            bnetAPI.getGuild(region,realm,name,[],function(error,guild){
                callback(error,guild);
            });
        },
        function(guild,callback){
            guildModel.upsert(
                {region:region,realm:guild.realm,name:guild.name},
                {$set:{region:region,realm:guild.realm,name:guild.name},$addToSet: {id: id}},
                function(error){
                    callback(error);
                });
        }
    ],function(error){
        callback(error);
    });
};

module.exports.checkPermsAndUpsert = function(region,realm,name,id,guild,callback){
    async.waterfall([
        function(callback){
            userService.hasGuildRankPermission(id,region,realm,name,['ad', 'edit'],function(error, hasPerm) {
            });
        },
        function(hasPerm,callback){

        }
    ])


};

