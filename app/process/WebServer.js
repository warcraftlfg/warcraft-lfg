"use strict";

//Module dependencies
var env = process.env.NODE_ENV || "dev";
var config = process.require("app/config/config."+env+".json");
var path = require("path");
var fs = require('fs');
var https = require('https');
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var passportSocketIo = require("passport.socketio");
var logger = process.require("app/api/logger.js").get("logger");


/**
 * WebServer creates an HTTP server for the application,
 * which serves front and back end pages.
 * @class WebServer
 * @constructor
 */
function WebServer(){
    //Configuration
    this.privateKey  = fs.readFileSync(config.server.key, 'utf8');
    this.certificate = fs.readFileSync(config.server.crt, 'utf8');

    //Initialise Server
    this.app = express();
    this.server = https.createServer({key: this.privateKey, cert: this.certificate},this.app);
    this.io = require('socket.io')(this.server);

}

module.exports = WebServer;

/**
 * Load Middlewares witch need to operate on each request
 * @param {Database} db The application database
 */
WebServer.prototype.onDatabaseAvailable = function(db){


    //Load sockets for socket.io messaging
    process.require('app/sockets/users.js')(this.io);
    process.require('app/sockets/guildAds.js')(this.io);

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
    //passport Initialize : Need to be done after session settings DB
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Initialize passport (authentication manager)
    process.require("app/passport.js");

    //Create route for Oauth
    this.app.get("/auth/bnet", passport.authenticate("bnet"));
    this.app.get("/auth/bnet/callback", passport.authenticate("bnet", { successRedirect: "/",failureRedirect: "/" }));

    //Create route for logout
    this.app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    //Create static repository
    this.app.use(express.static(path.join(process.root, "public")));



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
        logger.info("Server listening on port %s", server.address().port);
    });

};
