"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var validator = process.require("core/utilities/validators/validator.js");

/**
 * Upsert a kill
 * @param region
 * @param realm
 * @param name
 * @param raid
 * @param boss
 * @param bossWeight
 * @param difficulty
 * @param timestamp
 * @param source
 * @param callback
 */
module.exports.upsert = function(region,realm,name,raid,boss,bossWeight,difficulty,timestamp,source,callback) {
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name,raid:raid,boss:boss,bossWeight:bossWeight,difficulty:difficulty,timestamp:timestamp,source:source},function(error){
                callback(error);
            });
        },
        function(callback){
            //Upsert
            var guildKill = {};
            guildKill.region = region;
            guildKill.realm = realm;
            guildKill.name = name;
            guildKill.boss = boss;
            guildKill.bossWeight = bossWeight;
            guildKill.difficulty  = difficulty;
            guildKill.timestamp = timestamp;
            guildKill.source = source;

            guildKill.updated = new Date().getTime();
            var collection = applicationStorage.mongo.collection(raid);
            collection.update({region:region,realm:realm,name:name,boss:boss,difficulty:difficulty,timestamp:timestamp,source:source}, guildKill, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};