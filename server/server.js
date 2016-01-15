"use strict";

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function(filePath){
    return require(path.normalize(process.root + "/app/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var mongo =  require('mongodb').MongoClient;
var redis = require("redis");
var winston = require("winston");
var applicationStorage = process.require("core//applicationStorage");

var ready = require('readyness');
var started = ready.waitFor('started');


var processNames = [];
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

//Start all process if no args are found
if(processNames.length == 0 ) {
    processNames = [
        "GuildUpdateProcess",
        "CharacterUpdateProcess",
        /*"RealmUpdateProcess",
        "WowProgressUpdateProcess",
        "CleanerProcess",
        "AuctionUpdateProcess",
        "AdUpdateProcess",
        "GuildProgressUpdateProcess",*/
        "WebServerProcess"
    ];
}

//Load config file
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var logger = null;

async.waterfall([
    //Load the config file
    function(callback){
        applicationStorage.config = config;
        callback();
    },
    //Initialize the logger
    function(callback){

        var transports = [new (winston.transports.File)({
            filename: config.logger.folder+"/"+env+".log",
            maxsize : 104857600,
            zippedArchive: true
        })];
        if(env =="dev")
            transports.push(new (winston.transports.Console)());

        applicationStorage.logger = logger = new (winston.Logger)({
            level: config.logger.level,
            transports: transports
        });
        callback();


    },
    // Establish a connection to the database
    function(callback) {
        async.parallel([
                function(callback){
                    mongo.connect(config.database.mongo, function(error, db) {
                        logger.verbose("Mongo connected");
                        applicationStorage.mongo = db;
                        callback(error);

                    });
                },
                function(callback) {
                    var db = redis.createClient(config.database.redis);
                    db.on("error", function (error) {
                        callback(error);
                    });

                    db.on("ready", function () {
                        logger.verbose("Redis connected");
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
        async.each(processes,function(process,callback){

            process.start(function(error){
                callback(error);
            });

        },function(error){

            callback(error);
        });
    }
],function(error){
    started();
    if(error)
        logger.error(error);
});