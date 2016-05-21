"use strict";

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function (filePath) {
    return require(path.normalize(process.root + "/app/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var mongo = require('mongodb').MongoClient;
var redis = require("redis");
var winston = require("winston");
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var applicationStorage = process.require("core//applicationStorage");

var ready = require('readyness');
var started = ready.waitFor('started');


var processNames = [];


// -port get the port number
if (process.argv.indexOf("-p") != -1) {
    var port = parseInt(process.argv[process.argv.indexOf("-p") + 1], 10);

    if (isNaN(port)) {
        port = 3000;
    }
}


// -ws start WebServerProcess (need to be first for socket.io)
if (process.argv.indexOf("-ws") != -1) {
    processNames.push("WebServerProcess");
}

// -gu start GuildUpdateProcess
if (process.argv.indexOf("-gu") != -1) {
    processNames.push("GuildUpdateProcess");
}

// -cu start CharacterUpdateProcess
if (process.argv.indexOf("-cu") != -1) {
    processNames.push("CharacterUpdateProcess");
}

// -wp start WowProgressUpdateProcess
if (process.argv.indexOf("-wp") != -1) {
    processNames.push("WowProgressUpdateProcess");
}

// -clean start CleanerProcess
if (process.argv.indexOf("-cron") != -1) {
    processNames.push("Cron");
}

//Start all process if no args are found
if (processNames.length == 0) {
    processNames = [
        "GuildUpdateProcess",
        "CharacterUpdateProcess",
        "WowProgressUpdateProcess",
        "Cron",
        "WebServerProcess"
    ];
}

var autoStop = true;
//Disable AutoStop if any of this process is loaded
if (processNames.indexOf("GuildUpdateProcess") != -1
    || processNames.indexOf("CharacterUpdateProcess") != -1
    || processNames.indexOf("WebServerProcess") != -1
    || processNames.indexOf("WowProgressUpdateProcess") != -1) {
    autoStop = false;
}

//Load config file
var env = process.env.NODE_ENV || "development";
var config = process.require("config/config.json");

var logger = null;

async.waterfall([
    //Load the config file
    function (callback) {
        applicationStorage.config = config;
        callback();
    },
    //Initialize the logger
    function (callback) {

        var transports = [

            new (require("winston-daily-rotate-file"))({
                filename: config.logger.folder + "/" + env + ".log",
                json: false,
                handleExceptions: true,
                formatter: function (options) {
                    // Return string will be passed to logger.
                    return new Date().toString() + ' - ' + process.pid + ' - ' + options.level.toUpperCase() + ' - ' + (undefined !== options.message ? options.message : '') +
                        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
                }
            })];
        if (env == "development") {
            transports.push(new (winston.transports.Console)({handleExceptions: true}));
        }

        applicationStorage.logger = logger = new (winston.Logger)({
            level: config.logger.level,
            transports: transports
        });

        callback();
    },
    // Establish a connection to the database
    function (callback) {
        async.parallel([
                function (callback) {
                    mongo.connect(config.database.mongo, function (error, db) {
                        logger.verbose("Mongo connected");
                        applicationStorage.mongo = db;
                        callback(error);

                    });
                },
                function (callback) {
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
            function (error) {
                callback(error)
            });
    },
    //Start the mail transporter
    function (callback) {
        var mailConfig = wellknown(config.mail.service);
        mailConfig.auth = {user: config.mail.user, pass: config.mail.pass};
        mailConfig.poll = true;

        applicationStorage.mailTransporter = nodemailer.createTransport(mailConfig);
        callback();
    },
    //Create instance of processes
    function (callback) {
        var processes = [];
        async.forEachSeries(processNames, function (processName, callback) {
            var obj = process.require("process/" + processName + ".js");
            processes.push(new obj(autoStop, port));
            callback();
        }, function () {
            callback(null, processes);
        });
    },
    // Start Processes
    function (processes, callback) {
        async.each(processes, function (process, callback) {
            process.start(function (error) {
                callback(error);
            });
        }, function (error) {
            callback(error);
        });
    }
], function (error) {
    started();
    if (error) {
        logger.error(error);
    }
});