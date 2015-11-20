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

//Check strat parameters default for dev is true
var startWebserver = true;
var startGuildUpdateProcess = true;
var startCharacterUpdateProcess = true;
var startWowProgressUpdateProcess = true;
var startCleanerProcess = true;
var startAuctionUpdateProcess = true;
var startRealmUpdateProcess = true;
var startAdUpdateProcess = true;

//Check if an argument is provided
if(process.argv.length == 3 ){
    startWebserver = false;
    startGuildUpdateProcess = false;
    startCharacterUpdateProcess = false;
    startWowProgressUpdateProcess = false;
    startCleanerProcess = false;
    startAuctionUpdateProcess = false;
    startRealmUpdateProcess = false;
    startAdUpdateProcess = false;

    // -gu start GuildUpdateProcess
    if(process.argv[2] ==="-gu")
        startGuildUpdateProcess=true;

    // -cu start CharacterUpdateProcess
    if(process.argv[2] ==="-cu")
        startCharacterUpdateProcess=true;

    // -ru start RealmUpdateProcess
    if(process.argv[2] ==="-ru")
        startRealmUpdateProcess=true;

    // -wp start WowProgressUpdateProcess
    if(process.argv[2] ==="-wp")
        startWowProgressUpdateProcess=true;

    // -clean start CleanerProcess
    if(process.argv[2] ==="-clean")
        startCleanerProcess=true;

    // -au start AuctionUpdateProcess
    if(process.argv[2] ==="-au")
        startAuctionUpdateProcess=true;

    // -adu start AdUpdateProcess
    if(process.argv[2] ==="-adu")
        startAdUpdateProcess=true;

    // -ws start webserver
    if(process.argv[2] ==="-ws")
        startWebserver=true;

}

//Initialize Logger
var logger = loggerAPI.get("logger",config.logger);

//Load WebServer
var WebServer = process.require("process/WebServer.js");
var webServer = new WebServer();

//Load processes
var CharacterUpdateProcess = process.require("process/CharacterUpdateProcess.js");
var characterUpdateProcess = new CharacterUpdateProcess();
var GuildUpdateProcess = process.require("process/GuildUpdateProcess.js");
var guildUpdateProcess = new GuildUpdateProcess();
var WowProgressUpdateProcess = process.require("process/WowProgressUpdateProcess.js");
var wowProgressUpdateProcess = new WowProgressUpdateProcess();
var CleanerProcess = process.require("process/CleanerProcess.js");
var cleanerProcess = new CleanerProcess();
var AuctionUpdateProcess = process.require("process/AuctionUpdateProcess.js");
var auctionUpdateProcess = new AuctionUpdateProcess();
var RealmUpdateProcess = process.require("process/RealmUpdateProcess.js");
var realmUpdateProcess = new RealmUpdateProcess();
var AdUpdateProcess = process.require("process/AdUpdateProcess.js");
var adUpdateProcess = new AdUpdateProcess();

async.series([
    // Establish a connection to the database
    function(callback) {

        var mongoDb = new MongoDatabase(config.database.mongodb);
        var redisDb = new RedisDatabase(config.database.redis);
        // Establish connection to the database

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
                if(startWebserver)
                    webServer.onDatabaseAvailable(mongoDb);
                callback()
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
        if(startAuctionUpdateProcess)
            auctionUpdateProcess.start();
        if(startRealmUpdateProcess)
            realmUpdateProcess.start();
        if(startAdUpdateProcess)
            adUpdateProcess.start();
        callback();
    }
]);