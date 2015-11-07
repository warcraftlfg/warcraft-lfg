"use strict";

//Module dependencies
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var path = require("path");
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var passportSocketIo = require("passport.socketio");
var logger = process.require("api/logger.js").get("logger");
var compress = require('compression');
var applicationStorage = process.require('api/applicationStorage.js');
var userSocket = process.require('sockets/userSocket.js');
var characterSocket = process.require('sockets/characterSocket.js');
var guildSocket = process.require('sockets/guildSocket.js');
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');


/**
 * WebServer creates an HTTP server for the application,
 * which serves front and back end pages.
 * @class WebServer
 * @constructor
 */
function WebServer(){



    //Configuration

    this.app = express();

    if(config.server.https){
        this.privateKey  = fs.readFileSync(config.server.https.key, 'utf8');
        this.certificate = fs.readFileSync(config.server.https.crt, 'utf8');
        this.server = https.createServer({key: this.privateKey, cert: this.certificate},this.app);
    }
    else
        this.server = http.createServer(this.app);

    this.io = require('socket.io')(this.server);
    applicationStorage.setSocketIo(this.io);

    //Start redis for socket.io
    if(config.database.redis){
        if (config.database.redis.password){
            var pub = redis(config.database.redis.port, config.database.redis.host, { auth_pass: config.database.redis.password });
            var sub = redis(config.database.redis.port, config.database.redis.host, { detect_buffers: true, auth_pass: config.database.redis.password });
            this.io.adapter(adapter({ pubClient: pub, subClient: sub }));
        }
        else
            this.io.adapter(adapter({ host: config.database.redis.host, port: config.database.redis.port }));
    }

}

module.exports = WebServer;

/**
 * Load Middlewares witch need to operate on each request
 * @param {Database} db The application database
 */
WebServer.prototype.onDatabaseAvailable = function(db){


    //Load sockets for socket.io messaging
    userSocket.connect();
    characterSocket.connect();
    guildSocket.connect();
    //Create sessionStore inside Mongodb
    var sessionStore =  new MongoStore({db: db.db});

    //Update Session store with opened database connection
    //Allowed server to restart without loosing any session
    this.app.use(session({
        key: 'wgt.sid',
        secret: config.session.secret,
        store:sessionStore,
        saveUninitialized: true,
        resave: true
    }));

    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    //this.app.use(compress());            // Compress response data with gzip
    //passport Initialize : Need to be done after session settings DB
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Initialize passport (authentication manager)
    process.require("middleware/passport.js");

    //Create route for Oauth
    this.app.get("/auth/bnet", passport.authenticate("bnet"));
    this.app.get("/auth/bnet/callback", passport.authenticate("bnet", { successRedirect: "/",failureRedirect: "/" }));

    //Create route for logout
    this.app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });


    this.app.use('/', express.static(path.join(process.root, "../client")));
    this.app.use('/vendor', express.static(path.join(process.root, "../bower_components")));


    this.io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: "wgt.sid",
        secret: config.session.secret,
        store: sessionStore,
        success: function(data, accept){ accept();},
        fail: function(data, message, error, accept){ accept();}
    }));
};

/**
 * Starts the HTTP server.
 *
 * @method startServer
 */
WebServer.prototype.start = function(){

    // Start server
    var server = this.server.listen(config.server.port, function(){
        var protocol = config.server.https ? "HTTPS ": "HTTP"
        logger.info("Server "+protocol+" listening on port %s", server.address().port);
    });


};
