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
var loggerAPI = process.require("api/logger.js");
var applicationStorage = process.require("api/applicationStorage");

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");

//Check strat parameters
var startWebserver = true;
var startGuildUpdateProcess = true;
var startCharacterUpdateProcess = true;
if(process.argv.length == 3 ){
    startWebserver = false;
    startGuildUpdateProcess = false;
    startCharacterUpdateProcess = false;

    if(process.argv[2] ==="-gu")
        startGuildUpdateProcess=true;
    if(process.argv[2] ==="-cu")
        startCharacterUpdateProcess=true;
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

async.series([
    // Establish a connection to the database
    function(callback) {

        var db = new MongoDatabase(config.database);
        // Establish connection to the database
        db.connect(function(error) {
            if (error) {
                logger.error(error.message);
                process.exit(0);
            }

            applicationStorage.setDatabase(db);
            if(startWebserver)
                webServer.onDatabaseAvailable(db);

            callback();
        });
    },
    // Start Process
    function(callback){
        if(startWebserver)
            webServer.start();
        //if(startCharacterUpdateProcess)
        //    characterUpdateProcess.start();
        if (startGuildUpdateProcess)
            guildUpdateProcess.start();
        callback();
    }
]);