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
var globalSocket = process.require('sockets/globalSocket.js');
var userSocket = process.require('sockets/userSocket.js');
var characterSocket = process.require('sockets/characterSocket.js');
var guildSocket = process.require('sockets/guildSocket.js');
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');
var num_processes = require('os').cpus().length;
var cluster = require('cluster');
var net = require('net');
var sio = require('socket.io');


/**
 * WebServer creates an HTTP server for the application,
 * which serves front and back end pages.
 * @class WebServer
 * @constructor
 */
function WebServer(){
var self=this;

    if (cluster.isMaster) {
        this.workers = [];

        var spawn = function(i) {
            self.workers[i] = cluster.fork();

            // Optional: Restart worker on exit
            self.workers[i].on('exit', function(worker, code, signal) {
                logger.info('respawning worker', i);
                spawn(i);
            });
        };
        for (var i = 0; i < num_processes; i++) {
            spawn(i);
        }






    } else {



        //Configuration
        this.privateKey = fs.readFileSync(config.server.key, 'utf8');
        this.certificate = fs.readFileSync(config.server.crt, 'utf8');

        //Initialise HTTP &  HTTPS Server
        this.app = express();
        this.secureServer = https.createServer({key: this.privateKey, cert: this.certificate}, this.app);
        this.server = http.createServer(this.app);


        this.io = sio(this.secureServer);
        this.io.set('transports', ['polling']);
        applicationStorage.setSocketIo(this.io);

    }

}

module.exports = WebServer;


WebServer.prototype.worker_index = function(ip, len) {
    var s = '';
    for (var i = 0, _len = ip.length; i < _len; i++) {
        if (ip[i] !== '.') {
            s += ip[i];
        }
    }

    return 1;//Number(s) % len;
};

/**
 * Load Middlewares witch need to operate on each request
 * @param {Database} db The application database
 */
WebServer.prototype.onDatabaseAvailable = function(db){


    if (!cluster.isMaster) {

        //Start redis
        if (config.database.redis.password) {
            var pub = redis(config.database.redis.port, config.database.redis.host, {auth_pass: config.database.redis.password});
            var sub = redis(config.database.redis.port, config.database.redis.host, {
                detect_buffers: true,
                auth_pass: config.database.redis.password
            });
            this.io.adapter(adapter({pubClient: pub, subClient: sub}));
        }
        else
            this.io.adapter(adapter({host: config.database.redis.host, port: config.database.redis.port}));

        // Listen to messages sent from the master. Ignore everything else.
        process.on('message', function(message, connection) {
            if (message !== 'sticky-session:connection') {
                return;
            }

            console.log('lalala');
            // Emulate a connection event on the server by emitting the
            // event with the connection the master sent us.
            self.secureServer.emit('connection', connection);
            console.log(connection);
            connection.resume();
        });


        //Load sockets for socket.io messaging
        globalSocket.connect();
        userSocket.connect();
        characterSocket.connect();
        guildSocket.connect();
        //Create sessionStore inside Mongodb
        var sessionStore = new MongoStore({db: db.db});


        //Automatic redirect to https
        this.app.use(function (req, res, next) {
            if (!/https/.test(req.protocol)) {
                res.redirect("https://" + req.headers.host + req.url);
            } else {
                return next();
            }
        });


        //Update Session store with opened database connection
        //Allowed server to restart without loosing any session
        this.app.use(session({
            key: 'wgt.sid',
            secret: config.session.secret,
            store: sessionStore,
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
        this.app.get("/auth/bnet/callback", passport.authenticate("bnet", {
            successRedirect: "/",
            failureRedirect: "/"
        }));

        //Create route for logout
        this.app.get('/logout', function (req, res) {
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
            success: function (data, accept) {
                accept();
            },
            fail: function (data, message, error, accept) {
                accept();
            }
        }));
    }
};

/**
 * Starts the HTTP server.
 *
 * @method startServer
 */
WebServer.prototype.start = function(){

var self = this;
    if (cluster.isMaster) {
        this.secureServer = net.createServer({ pauseOnConnect: true }, function(connection) {
            // We received a connection and need to pass it to the appropriate
            // worker. Get the worker for this connection's source IP and pass
            // it the connection.
            var worker = self.workers[self.worker_index(connection.remoteAddress, num_processes)];
            worker.send('sticky-session:connection', connection);
        }).listen(config.server.securePort);


    }else{
        var secureServer = self.secureServer.listen(0, function(){
            logger.info("Server HTTPS listening on port %s", secureServer.address().port);
        });
        // Start server
        var server = self.server.listen(0, function(){
            logger.info("Server HTTP listening on port %s", server.address().port);
        });
    }





};
