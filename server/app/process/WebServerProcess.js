"use strict";

//Load dependencies
var path = require("path");
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var passport = require("passport");
var passportSocketIo = require("passport.socketio");
var compression = require('compression');
var applicationStorage = process.require('core/applicationStorage.js');
var adapter = require('socket.io-redis');

var config = applicationStorage.config;
var logger = applicationStorage.logger;

/**
 * WebServer creates an HTTP server for the application,
 * which serves front and back end pages.
 * @class WebServerProcess
 * @constructor
 */
function WebServerProcess(autoStop, port) {

    this.port = port || 3000;
    this.app = express();

    if (config.server.https) {
        this.privateKey = fs.readFileSync(config.server.https.key, 'utf8');
        this.certificate = fs.readFileSync(config.server.https.cert, 'utf8');
        this.server = https.createServer({key: this.privateKey, cert: this.certificate}, this.app);
    }
    else {
        this.server = http.createServer(this.app);
    }

    this.io = require('socket.io')(this.server);
    applicationStorage.socketIo = this.io;

    //Start redis for socket.io
    this.io.adapter(adapter(applicationStorage.redis));

    //Create sessionStore inside Mongodb
    var sessionStore = new mongoStore({db: applicationStorage.mongo});

    //Update Session store with opened database connection
    //Allowed server to restart without loosing any session
    this.app.use(session({
        key: 'wgt.sid',
        secret: config.session.secret,
        store: sessionStore,
        saveUninitialized: true,
        resave: true
    }));

    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    //Initialize auth routes
    this.app.use(process.require("users/routes.js"));

    //Initialize api v1 routes
    this.app.use('/api/v1', process.require("characters/routes.js"));
    this.app.use('/api/v1', process.require("guilds/routes.js"));
    this.app.use('/api/v1', process.require("realms/routes.js"));
    this.app.use('/api/v1', process.require("updates/routes.js"));
    this.app.use('/api/v1', process.require("messages/routes.js"));

    //Initialize static folders
    this.app.use('/', express.static(path.join(process.root, "../www")));
    this.app.use('/vendor', express.static(path.join(process.root, "../bower_components")));

    //Catch all error and log them
    this.app.use(function (error, req, res, next) {
        logger.error("Error on request", error);
        res.status(error.statusCode).json({error: error.statusCode, message: "Internal Server Error"});
    });

    //Log all other request and send 404
    this.app.use(function (req, res) {
        logger.error("Error 404 on request %s", req.url);
        res.status(404).send({error: 404, message: "The requested URL was not found on this server."});
    });

    this.io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: "wgt.sid",
        secret: config.session.secret,
        store: sessionStore,
        success: function (data, accept) {
            accept();
        },
        fail: function (data, message, error, accept) {
            accept();
        }
    }));

}

/**
 * Starts the HTTP server.
 * @method start
 */
WebServerProcess.prototype.start = function (callback) {
    logger.info("Starting WebServerProcess");
    // Start server
    var server = this.server.listen(this.port, function () {
        var protocol = config.server.https ? "HTTPS " : "HTTP";
        logger.info("Server " + protocol + " listening on port %s", server.address().port);
        callback();
    });
};

module.exports = WebServerProcess;

