"use strict"

//Module dependencies
var passport = require("passport");
var BnetStrategy = require("passport-bnet").Strategy;
var UserModel = process.require("app/models/UserModel.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('/app/config/config.'+env+'.json');

//Define Battlenet Oauth authentication strategy.
passport.use(new BnetStrategy({
            clientID: config.oauth.bnet.client_id,
            clientSecret: config.oauth.bnet.client_secret,
            scope: "wow.profile",
            callbackURL: config.oauth.bnet.callback_url
        },
        function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
            //TODO Find or createOauthUser
            /*module.exports.findOrCreateOauthUser(profile.id,profile.battletag,profile.accessToken,function(user){
             return done(null, user);
             });*/
        }
));

// In order to support login sessions, Passport serialize and
// deserialize user instances to and from the session.
// Only the user ID is serialized to the session.
passport.serializeUser(function(user, done) {
    done(null, user);
});

// When subsequent requests are received, the ID is used to find
// the user, which will be restored to req.user.
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
