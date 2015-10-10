"use strict"

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function(filePath){
    return require(path.normalize(process.root + "/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var MongoDatabase = process.require("/app/api/MongoDatabase.js");
var loggerAPI = process.require("/app/api/logger.js");
var applicationStorage = process.require("app/api/applicationStorage");

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("/app/config/config."+env+".json");

//Load WebServer
var logger= loggerAPI.get("wow-guild-recruitment",config.logger);
var WebServer = process.require("/app/process/WebServer.js");
var webServer = new WebServer();

async.series([
    // Establish a connection to the database and start process
    function(callback) {

        var db = new MongoDatabase(config.database);
        // Establish connection to the database
        db.connect(function(error) {
            if (error) {
                logger.error(error.message);
                process.exit(0);
            }

            applicationStorage.setDatabase(db);
            webServer.onDatabaseAvailable(db);

            callback();
        });
    },
    //TODO CRON ??? Update DB ???
    // Start Process
    function(callback){
        webServer.startServer();
        callback();
    }
]);