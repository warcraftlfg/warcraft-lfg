"use strict"

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function(filePath){
    return require(path.normalize(process.root + "/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var Database = process.require('/app/api/Database.js');
var loggerAPI = process.require('/app/api/logger.js');


//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('/app/config/config.'+env+'.json');

//Load WebServer
var logger= loggerAPI.get('wow-guild-recruitment',config.logger);
var WebServer = process.require("/app/process/WebServer.js");
var webServer = new WebServer();

async.series([
    // Establish a connection to the database
    function(callback) {

        var db = Database.getDatabase(config.database);
        // Establish connection to the database
        db.connect(function(error) {
            if (error) {
                logger.error(error.message);
                process.exit(0);
            }

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