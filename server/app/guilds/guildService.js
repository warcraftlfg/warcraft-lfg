"use strict";

var async = require("async");
var applicationStorage = process.require("api/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var bnetAPI = process.require("api/bnet.js");

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

/**
 * Return the last 5 guilds
 * @param criteria
 * @param sort
 * @param limit
 * @param callback
 */
module.exports.find = function(criteria,sort,limit,callback){
    guildModel.find(criteria,{name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1,"_id":0}).sort(sort).limit(limit).exec(function(error,guilds){
        callback(error,guilds);
    });
};

/**
 * Return the number of guilds LFG
 * @param criteria
 * @param callback
 */
module.exports.count = function(criteria,callback){
    guildModel.count(criteria,function(error,guildsCount){
        callback(error,guildsCount);
    });
};