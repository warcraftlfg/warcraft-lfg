"use strict"

//Module dependencies
var passport = require("passport");
var BnetStrategy = require("passport-bnet").Strategy;
var UserModel = process.require("models/UserModel.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var userModel = new UserModel();

//Define Battlenet Oauth authentication strategy.
passport.use(new BnetStrategy({
            clientID: config.oauth.bnet.client_id,
            clientSecret: config.oauth.bnet.client_secret,
            scope: "wow.profile",
            callbackURL: config.oauth.bnet.callback_url
        },
        function(accessToken, refreshToken, profile, done) {
            profile.accessToken = accessToken;
            userModel.findOrCreateOauthUser(profile,function(user){
                return done(null, user);
            });
        }
));

// In order to support login sessions, Passport serialize and
// deserialize user instances to and from the session.
// Only the user ID is serialized to the session.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// When subsequent requests are received, the ID is used to find
// the user, which will be restored to req.user.
passport.deserializeUser(function(id, done) {
    userModel.findById(id,function(error,user){
        if(user)
            done(null, user);
        else
            done(null, false);
    });
});
