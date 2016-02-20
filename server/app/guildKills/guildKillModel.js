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
                    collection.updateOne({region:region,realm:realm,name:name,boss:boss,bossWeight:bossWeight,difficulty:difficulty,timestamp:timestamp,source:source},{$set:guildKill},
                        {upsert:true}, function(error){
                            callback(error);
                        });
                },
                function(callback){
                    if(progress) {
                        collection.updateOne({region: region,realm: realm,name: name,boss: boss,difficulty: difficulty,timestamp: timestamp,source: source,"roster.name": {$ne: progress.name}}, {$push: {roster: progress}}, function (error) {
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


/**
 * Map reduce for
 * @param region
 * @param realm
 * @param name
 * @param raid
 * @param callback
 */
module.exports.computeProgress = function(region,realm,name,raid,callback){

    async.waterfall([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name,raid:raid},function(error){
                callback(error);
            });
        },
        function(callback) {
            //Upsert
            var map = function(){
                var mapped = {
                    timestamp:this.timestamp,
                    roster:this.roster,
                    source:this.source
                };
                var key = {difficulty:this.difficulty,boss:this.boss};
                emit(key, mapped);
            };

            var reduce = function(key, values){
                var reduced = {timestamps:[]};

                if (values && values[0] && values[0].timestamps) {
                    reduced = values[0];
                }

                for (var idx = 0; idx < values.length; idx++) {
                    if (values[idx].source === "wowprogress") {
                        if (idx < values.length -1 && values[idx].timestamp + 1000 <= values[idx + 1].timestamp && values[idx + 1].source == "progress"){
                            //Add only if no progress are found in + or - 1 sec of wowprogress entry
                            reduced.timestamps.push([values[idx].timestamp]);
                        } else {
                            reduced.timestamps.push([values[idx].timestamp]);
                        }
                    }
                    else if (values[idx].source === "progress") {
                        if (idx < values.length - 1 && values[idx].timestamp + 1000 >= values[idx + 1].timestamp) {
                            var rosterLength = values[idx].roster.length + values[idx + 1].roster.length;
                            if ((key.difficulty == "mythic" && rosterLength >= 16) || ((key.difficulty == "normal" || key.difficulty == "heroic") && rosterLength >= 8)) {
                                reduced.timestamps.push([values[idx].timestamp, values[idx + 1].timestamp]);
                            }
                            idx++;
                        } else {
                            if (values[idx].roster && ((key.difficulty == "mythic" && values[idx].roster.length >= 16) || ((key.difficulty == "normal" || key.difficulty == "heroic") && values[idx].roster.length >= 8 ))) {
                                reduced.timestamps.push([values[idx].timestamp]);
                            }
                        }
                    }
                }
                return reduced;
            };

            var finalize = function(key, value){
                if (value.timestamp) {

                    if ( (value.source == "progress" && ((key.difficulty == "mythic" && value.roster.length >= 16 ) || ((key.difficulty == "normal" || key.difficulty =="heroic") && value.roster.length >= 8))) || value.source == "wowprogress") {
                        return {timestamps:[[value.timestamp]]};
                    } else {
                        return {timestamps:[]};
                    }
                }
                return value;
            };

            var collection = applicationStorage.mongo.collection(raid);
            collection.mapReduce(map, reduce, {out:{ inline: 1}, finalize:finalize, query:{region:region,realm:realm,name:name}, sort:{bossWeight:1, timestamp:1, source:-1}}, function(error, result) {
                callback(error,result);
            });
        }
    ],function(error,result){
        callback(error,result);
    });
};

