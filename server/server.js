"use strict";

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
var loggerAPI = process.require("api/logger.js");
var applicationStorage = process.require("api/applicationStorage");

var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");

var processes = [
    "GuildUpdateProcess",
    "CharacterUpdateProcess",
    "RealmUpdateProcess",
    "WowProgressUpdateProcess",
    "CleanerProcess",
    "AuctionUpdateProcess",
    "AdUpdateProcess",
    "GuildProgressUpdateProcess",
    "WebServer"
];

//Check if arguments are provided
if(process.argv.length > 2 ){
    processes = [];
    // -gu start GuildUpdateProcess
    if(process.argv.indexOf("-gu")!=-1)
        processes.push("GuildUpdateProcess");

    // -cu start CharacterUpdateProcess
    if(process.argv.indexOf("-cu")!=-1)
        processes.push("CharacterUpdateProcess");

    // -ru start RealmUpdateProcess
    if(process.argv.indexOf("-ru")!=-1)
        processes.push("RealmUpdateProcess");

    // -wp start WowProgressUpdateProcess
    if(process.argv.indexOf("-wp")!=-1)
        processes.push("WowProgressUpdateProcess");

    // -clean start CleanerProcess
    if(process.argv.indexOf("-clean")!=-1)
        processes.push("CleanerProcess");

    // -au start AuctionUpdateProcess
    if(process.argv.indexOf("-au")!=-1)
        processes.push("AuctionUpdateProcess");

    // -adu start AdUpdateProcess
    if(process.argv.indexOf("-adu")!=-1)
        processes.push("AdUpdateProcess");

    // -gpu start GuildProgressUpdateProcess
    if(process.argv.indexOf("-gpu")!=-1)
        processes.push("GuildProgressUpdateProcess");

    // -ws start WebServer
    if(process.argv.indexOf("-ws")!=-1)
        processes.push("WebServer");
}

//Initialize Logger
var logger = loggerAPI.get("logger",config.logger);


async.series([
    // Establish a connection to the database
    function(callback) {

        var mongoDb = new MongoDatabase(config.database.mongodb);
        var redisDb = new RedisDatabase(config.database.redis);
        async.parallel([
                function(callback){
                    mongoDb.connect(function(error) {
                        if (error) {
                            logger.error(error.message);
                            process.exit(0);
                        }
                        applicationStorage.setMongoDatabase(mongoDb);
                        logger.debug("Mongodb connected");
                        callback();
                    });
                },
                function(callback) {
                    redisDb.connect(function(error) {
                        if (error) {
                            logger.error(error.message);
                            process.exit(0);
                        }
                        applicationStorage.setRedisDatabase(redisDb);
                        logger.debug("Redis connected");
                        callback();
                    });
                }
            ],
            function() {
                callback()
            });
    },
    // Start Processes
    function(callback){
        async.forEach(processes,function(processName){
            var obj = process.require("process/"+processName+".js");
            new obj().start();
        });
        callback();
    }
]);