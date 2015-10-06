var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    session = require('express-session'),
    sessionStore = require('connect-mongo')(session),
    env = process.env.NODE_ENV || 'dev',
    config = require('./server/config/config.'+env+'.json'),
    app = module.exports = express(),
    server = http.Server(app),
    io = require('socket.io')(server);


app.use(morgan('dev'));


app.use(session({
 key: 'sid',
 store: new sessionStore({url: 'mongodb://localhost/test-app'}),
 secret: "tata",
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

app.get('/auth/bnet', passport.authenticate('bnet'));
app.get('/auth/bnet/callback', passport.authenticate('bnet', { failureRedirect: '/' }), function(req, res){res.redirect('/');});



app.use(express.static(path.join(__dirname, 'client')));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'k1ss.sid',
    secret: config.session.secret,
    store: sessionStore
}));


server.listen(config.server.port, function(){
    console.log("Server listening on port " + config.server.port);
});


