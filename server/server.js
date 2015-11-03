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

var loggerAPI = process.require("api/logger.js");
var applicationStorage = process.require("api/applicationStorage");

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");

//Check strat parameters
var startWebserver = true;
var startGuildUpdateProcess = true;
var startCharacterUpdateProcess = true;
var startWowProgressUpdateProcess = true;
var startCleanerProcess = true;
var startAuctionImportProcess = true;
var startAuctionUpdateProcess = true;


if(process.argv.length == 3 ){
    startWebserver = false;
    startGuildUpdateProcess = false;
    startCharacterUpdateProcess = false;
    startWowProgressUpdateProcess = false;
    startCleanerProcess = false;
    startAuctionImportProcess = false;
    startAuctionUpdateProcess = false;

    if(process.argv[2] ==="-gu")
        startGuildUpdateProcess=true;
    if(process.argv[2] ==="-cu")
        startCharacterUpdateProcess=true;
    if(process.argv[2] ==="-wp")
        startWowProgressUpdateProcess=true;
    if(process.argv[2] ==="-clean")
        startCleanerProcess=true;
    if(process.argv[2] ==="-ai")
        startAuctionImportProcess=true;
    if(process.argv[2] ==="-au")
        startAuctionUpdateProcess=true;
    if(process.argv[2] ==="-ws")
        startWebserver=true;

}

var logger = loggerAPI.get("logger",config.logger);


//Load WebServer
var WebServer = process.require("process/WebServer.js");
var webServer = new WebServer();

//Load character update process
var CharacterUpdateProcess = process.require("process/CharacterUpdateProcess.js");
var characterUpdateProcess = new CharacterUpdateProcess();
var GuildUpdateProcess = process.require("process/GuildUpdateProcess.js");
var guildUpdateProcess = new GuildUpdateProcess();
var WowProgressUpdateProcess = process.require("process/WowProgressUpdateProcess.js");
var wowProgressUpdateProcess = new WowProgressUpdateProcess();
var CleanerProcess = process.require("process/CleanerProcess.js");
var cleanerProcess = new CleanerProcess();
var AuctionImportProcess = process.require("process/AuctionImportProcess.js");
var auctionImportProcess = new AuctionImportProcess();
var AuctionUpdateProcess = process.require("process/AuctionUpdateProcess.js");
var auctionUpdateProcess = new AuctionUpdateProcess();

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
            if(startWebserver)
                webServer.onDatabaseAvailable(mongoDb);

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
    // Start Process
    function(callback){
        if(startWebserver)
            webServer.start();
        if(startCharacterUpdateProcess)
            characterUpdateProcess.start();
        if (startGuildUpdateProcess)
            guildUpdateProcess.start();
        if (startWowProgressUpdateProcess)
            wowProgressUpdateProcess.start();
        if(startCleanerProcess)
            cleanerProcess.start();
        if(startAuctionImportProcess)
            auctionImportProcess.start();
        if(startAuctionUpdateProcess)
            auctionUpdateProcess.start();

        callback();
    }

]);