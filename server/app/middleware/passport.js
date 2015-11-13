"use strict"

//Module dependencies
var passport = require("passport");
var BnetStrategy = require("passport-bnet").Strategy;
var userModel = process.require("models/userModel.js");
var userService = process.require("services/userService.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");


//Define Battlenet Oauth authentication strategy.
passport.use(new BnetStrategy({
        clientID: config.oauth.bnet.client_id,
        clientSecret: config.oauth.bnet.client_secret,
        scope: "wow.profile",
        callbackURL: config.oauth.bnet.callback_url
    },
    function(accessToken, refreshToken, profile, done) {

        userModel.insertOrUpdate({id:profile.id,battleTag:profile.battletag, accessToken:accessToken},function(error,user){
            if(error){
                logger.error(error.message);
                return done(null,false);
            }
            userService.importGuilds(user.id);
            userService.updateCharactersId(user.id);
            userService.updateGuildsId(user.id);
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
            done(null,{id:user.id,battleTag:user.battleTag});
        else {
            logger.error(error.message);
            done(null, false);
        }
    });
});
