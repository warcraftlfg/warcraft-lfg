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
module.exports.upsert = function(region,realm,name,raid,boss,bossWeight,difficulty,timestamp,source,progress,callback) {
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
            var guildKill = {region:region,realm:realm,name:name,boss:boss,bossWeight:bossWeight,difficulty:difficulty,timestamp:timestamp,source:source,updated:new Date().getTime()}

            var collection = applicationStorage.mongo.collection(raid);
            async.series([
                function(callback){
                    collection.update({region:region,realm:realm,name:name,boss:boss,bossWeight:bossWeight,difficulty:difficulty,timestamp:timestamp,source:source},{$set:guildKill},
                        {upsert:true}, function(error){
                        callback(error);
                    });
                },
                function(callback){
                    if(progress) {
                        collection.update({region: region,realm: realm,name: name,boss: boss,difficulty: difficulty,timestamp: timestamp,source: source,"roster.name": {$ne: progress.name}}, {$push: {roster: progress}}, function (error) {
                            callback(error);
                        });
                    }
                    else{
                        callback();
                    }
                }
            ],function(error){
                callback(error);
            })

        }
    ],function(error){
        callback(error);
    });
};
