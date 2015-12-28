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

var processNames = [
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
    processNames = [];
    // -ws start WebServerProcess (need to be first for socket.io)
    if(process.argv.indexOf("-ws")!=-1)
        processNames.push("WebServerProcess");

    // -gu start GuildUpdateProcess
    if(process.argv.indexOf("-gu")!=-1)
        processNames.push("GuildUpdateProcess");

    // -cu start CharacterUpdateProcess
    if(process.argv.indexOf("-cu")!=-1)
        processNames.push("CharacterUpdateProcess");

    // -ru start RealmUpdateProcess
    if(process.argv.indexOf("-ru")!=-1)
        processNames.push("RealmUpdateProcess");

    // -wp start WowProgressUpdateProcess
    if(process.argv.indexOf("-wp")!=-1)
        processNames.push("WowProgressUpdateProcess");

    // -clean start CleanerProcess
    if(process.argv.indexOf("-clean")!=-1)
        processNames.push("CleanerProcess");

    // -au start AuctionUpdateProcess
    if(process.argv.indexOf("-au")!=-1)
        processNames.push("AuctionUpdateProcess");

    // -adu start AdUpdateProcess
    if(process.argv.indexOf("-adu")!=-1)
        processNames.push("AdUpdateProcess");

    // -gpu start GuildProgressUpdateProcess
    if(process.argv.indexOf("-gpu")!=-1)
        processNames.push("GuildProgressUpdateProcess");

}

//Initialize Logger
var logger = loggerAPI.get("logger",config.logger);


async.waterfall([
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
                        applicationStorage.mongoose = db;
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
                        applicationStorage.redis = db;
                        callback();
                    });
                }
            ],
            function(error) {
                callback(error)
            });
    },
    //Create instance of processes
    function(callback){
        var processes =  [];
        async.forEachSeries(processNames,function(processName,callback){
            var obj = process.require("process/"+processName+".js");
            processes.push(new obj());
            callback();
        },function(){
            callback(null,processes);
        });
    },
    // Start Processes
    function(processes,callback){
        async.forEachSeries(processes,function(process,callback){
            process.start();
            callback();
        },function(){
            callback();
        });

    }
],function(error){
    if(error)
        logger.error(error);
});