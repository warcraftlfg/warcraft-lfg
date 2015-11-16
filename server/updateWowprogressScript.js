"use strict"

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function(filePath){
    return require(path.normalize(process.root + "/app/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var MongoDatabase = process.require("api/MongoDatabase.js");
var RedisDatabase = process.require("api/RedisDatabase.js");

var applicationStorage = process.require("api/applicationStorage");
;

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var loggerAPI = process.require("api/logger.js");
var logger = loggerAPI.get("logger",config.logger)
var wowprogressAPI = process.require('api/wowProgress.js');

async.series([
    // Establish a connection to the database
    function(callback) {

        var mongoDb = new MongoDatabase(config.database.mongodb);
        var redisDb = new RedisDatabase(config.database.redis);
        // Establish connection to the database

        mongoDb.connect(function(error) {
            if (error) {
                console.log(error.message);
                process.exit(0);
            }

            applicationStorage.setMongoDatabase(mongoDb);

            redisDb.connect(function(error) {
                if (error) {
                    console.log(error.message);
                    process.exit(0);
                }
                applicationStorage.setRedisDatabase(redisDb);

                callback();

            });


        });
    },
    // Start Guild update
    function(callback){

        var database = applicationStorage.getMongoDatabase();

        database.find("guilds", {"ad.updated":{$exists:true}},{name:1,realm:1,region:1,"ad.updated":1,id:1}, 0, {"ad.updated":-1}, function(error,guilds){
            callback(error, guilds);

                //FOREACH GUILD GET WOWPROGRESS INFO ET SET THEM
                async.eachSeries(guilds,function(guild,callback){
                    if(guild.id.indexOf(0)!=-1){
                        wowprogressAPI.parseGuildPage("/"+guild.region+"/"+guild.realm+"/"+guild.name,function(error,guildAd){
                            console.log(guildAd);
                        });

                    }
                    else{
                        console.log(guild.id);
                    }
                    callback();
                });
        },function(){
            callback();
        });




    },
    // Start Characters update
    function(callback){
            //console.log(characters);
            //FOREACH GUILD GET WOWPROGRESS INFO ET SET THEM
        callback();
    }

]);