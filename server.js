var express = require('express'),
    http = require('http'),
    https = require('https'),
    passport = require('passport'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    sessionStore = new mongoStore({url: 'mongodb://localhost/wow-guild-recruit'}),
    User = require('./server/models/User.js'),
    env = process.env.NODE_ENV || 'dev',
    config = require('./server/config/config.'+env+'.json'),
    passportSocketIo = require("passport.socketio"),
    app  = express(),
    server = http.Server(app),
    io = require('socket.io')(server);


app.use(morgan('dev'));


app.use(session({
    key: 'sid',
    store: sessionStore,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true
}));


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
    if (req.isAuthenticated() ||
        req.path.indexOf('/login') != -1 ||
        req.path.indexOf('/auth') != -1 ||
        req.path.indexOf('.js') != -1 ||
        req.path.indexOf('.css') != -1 ||
        req.path.indexOf('webfont') != -1
    ) { return next(); }
    res.redirect('/login.html');
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login.html');
});

app.get('/auth/bnet',
    passport.authenticate('bnet'));
app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { successRedirect: '/',failureRedirect: '/login.html' }));




app.use(express.static(path.join(__dirname, 'client')));

passport.use('bnet', User.bnetStrategy());

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'sid',
    secret: config.session.secret,
    store: sessionStore
}));


server.listen(config.server.port, function(){
    console.log("Server listening on port " + config.server.port);
});


