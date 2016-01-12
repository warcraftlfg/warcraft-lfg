"use strict"

//Module dependencies
var passport = require("passport");
var BnetStrategy = require("passport-bnet").Strategy;
var applicationStorage = process.require("core/applicationStorage");
var userModel = process.require("users/userModel.js");
var userService = process.require("users/userService.js");

var config = applicationStorage.config;
var logger = applicationStorage.logger;

//Define Battlenet Oauth authentication strategy.
passport.use(new BnetStrategy({
        clientID: config.oauth.bnet.clientID,
        clientSecret: config.oauth.bnet.clientSecret,
        scope: "wow.profile",
        region:"eu",
        callbackURL: config.oauth.bnet.callbackURL
    },
    /** @namespace profile.battletag */
    function(accessToken, refreshToken, profile, done) {
        logger.verbose("%s connected",profile.battletag);

        var user = {id:profile.id,battleTag:profile.battletag, accessToken:accessToken};
        userModel.upsert(user,function(error){
            if(error){
                logger.error(error.message);
                return done(null,false);
            }
            done(null, user);
        });

        //Set user's guilds to Update
        userService.setGuildsToUpdate(user.id);

        //Set user's id on guild ad
        userService.updateGuildsId(user.id);

        //Set user's id on characters ad
        userService.updateCharactersId(user.id);
    }
));

// In order to support login sessions, Passport serialize and
// deserialize user instances to and from the session.
// Only the user ID is serialized to the session.
// noinspection JSUnresolvedFunction
passport.serializeUser(function(user, done) {
    logger.silly("serializeUser id:%s battleTag:%s accessToken:%s",user.id,user.battleTag,user.accessToken);
    done(null, user.id);
});

// When subsequent requests are received, the ID is used to find
// the user, which will be restored to req.user.
// noinspection JSUnresolvedFunction
passport.deserializeUser(function(id, done) {
    logger.silly("deserializeUser for id:%s", id);
    userModel.findById(id,function(error,user){
        if(user)
            done(null,{id:user.id,battleTag:user.battleTag});
        else {
            done(null, false);
        }
    });
});