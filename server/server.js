"use strict";

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function(filePath){
    return require(path.normalize(process.root + "/app/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var mongoose = require('mongoose');
var redis = require("redis");
var loggerAPI = process.require("api/logger.js");
var applicationStorage = process.require("api/applicationStorage");

//Load config file
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
    "WebServerProcess"
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
        processes.push("WebServerProcess");
}

//Initialize Logger
var logger = loggerAPI.get("logger",config.logger);


async.series([
    // Establish a connection to the database
    function(callback) {

        async.parallel([
                function(callback){
                    mongoose.connect(config.database.mongo);
                    var db = mongoose.connection;
                    db.on("error", function(error) {
                       callback(error);
                    });
                    db.once("open", function() {
                        logger.debug("Mongo connected");
                        global.mongoose = db;
                        callback();
                    });
                },
                function(callback) {
                    var db = redis.createClient(config.database.redis);
                    db.on("error", function (error) {
                        callback(error);
                    });

                    db.on("ready", function () {
                        logger.debug("Redis connected");
                        global.redis = db;
                        callback();
                    });
                }
            ],
            function(error) {
                if(error)
                    return logger.error(error.message,error);
                callback()
            });
    },
    // Start Processes
    function(callback){
        async.forEachSeries(processes,function(processName,callback){
            var obj = process.require("process/"+processName+".js");
            new obj().start();
            callback();
        },function(){
            callback();
        });
    }
]);