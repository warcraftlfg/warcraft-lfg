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

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");

var guildModel = process.require("models/guildModel.js");
var characterModel = process.require("models/characterModel.js");

async.series([
    // Establish a connection to the database
    function(callback) {

        var mongoDb = new MongoDatabase(config.database.mongodb);
        var redisDb = new RedisDatabase(config.database.redis);
        // Establish connection to the database

        mongoDb.connect(function(error) {
            if (error) {
                logger.error(error.message);
                process.exit(0);
            }

            applicationStorage.setMongoDatabase(mongoDb);

            redisDb.connect(function(error) {
                if (error) {
                    logger.error(error.message);
                    process.exit(0);
                }
                applicationStorage.setRedisDatabase(redisDb);

                callback();

            });


        });
    },
    // Start Guild update
    function(callback){
        guildModel.getAds(0,{},function(error,guilds){
            console.log(guilds);
            //FOREACH GUILD GET WOWPROGRESS INFO ET SET THEM
        });


        callback();
    },
    // Start Characters update
    function(callback){
        characterModel.getAds(0,{},function(error,characters){
            console.log(characters);
            //FOREACH GUILD GET WOWPROGRESS INFO ET SET THEM
        });
        callback();
    }

]);