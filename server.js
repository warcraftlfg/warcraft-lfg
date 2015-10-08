"use strict"

// Module dependencies
var async = require("async");
var api = require('./server/api');

//Load Application Server
var ApplicationServer = process.require("app/server/servers/ApplicationServer.js");
var server = new ApplicationServer();

async.series([

    // Establish a connection to the database
    function(callback) {
    }


    //Cron, other think ?

]);