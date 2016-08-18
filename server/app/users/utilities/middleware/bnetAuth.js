"use strict"

//Module dependencies
var async = require("async");
var passport = require("passport");
var BnetStrategy = require("passport-bnet").Strategy;
var applicationStorage = process.require("core/applicationStorage.js");
var userModel = process.require("users/userModel.js");
var userService = process.require("users/userService.js");

var config = applicationStorage.config;
var logger = applicationStorage.logger;

//Define Battlenet Oauth authentication strategy.
passport.use('bnet', new BnetStrategy({
        clientID: config.oauth.bnet.clientID,
        clientSecret: config.oauth.bnet.clientSecret,
        scope: "wow.profile",
        region: config.oauth.bnet.region || "eu",
        callbackURL: config.oauth.bnet.callbackURL
    },
    /** @namespace profile.battletag */
    function (accessToken, refreshToken, profile, done) {
        logger.verbose("%s connected", profile.battletag);

        async.waterfall([
            function (callback) {
                userModel.findById(profile.id, function (error, user) {
                    callback(error, user);
                });
            },
            function (user, callback) {
                if (user && user.id) {
                    user.battleTag = profile.battletag;
                    user.accessToken = accessToken;
                } else {
                    user = {id: profile.id, battleTag: profile.battletag, accessToken: accessToken};
                }
                userModel.upsert(user, function (error) {
                    callback(error,user);
                });

            }
        ], function (error,user) {
            if (error) {
                logger.error(error.message);
                return done(null, false);
            }
            //Set user's id on guild ad
            userService.updateGuildsId(user.id);

            //Set user's id on characters ad
            userService.updateCharactersId(user.id);
            done(null, user);
        });
    }
));

//Define Battlenet Oauth authentication strategy.
passport.use('bnet-lfg', new BnetStrategy({
        clientID: config.oauth.bnet.clientID,
        clientSecret: config.oauth.bnet.clientSecret,
        scope: "wow.profile",
        region: config.oauth.bnet.region || "eu",
        callbackURL: config.oauth.bnet.callbackLfgURL
    },
    /** @namespace profile.battletag */
    function (accessToken, refreshToken, profile, done) {
        logger.verbose("%s connected", profile.battletag);

        async.waterfall([
            function (callback) {
                userModel.findById(profile.id, function (error, user) {
                    callback(error, user);
                });
            },
            function (user, callback) {
                if (user && user.id) {
                    user.battleTag = profile.battletag;
                    user.accessToken = accessToken;
                } else {
                    user = {id: profile.id, battleTag: profile.battletag, accessToken: accessToken};
                }
                userModel.upsert(user, function (error) {
                    callback(error,user);
                });

            }
        ], function (error,user) {
            if (error) {
                logger.error(error.message);
                return done(null, false);
            }
            //Set user's id on guild ad
            userService.updateGuildsId(user.id);

            //Set user's id on characters ad
            userService.updateCharactersId(user.id);
            done(null, user);
        });
    }
));

//Define Battlenet Oauth authentication strategy.
passport.use('bnet-progress', new BnetStrategy({
        clientID: config.oauth.bnet.clientID,
        clientSecret: config.oauth.bnet.clientSecret,
        scope: "wow.profile",
        region: config.oauth.bnet.region || "eu",
        callbackURL: config.oauth.bnet.callbackProgressURL
    },
    /** @namespace profile.battletag */
    function (accessToken, refreshToken, profile, done) {
        logger.verbose("%s connected", profile.battletag);

        async.waterfall([
            function (callback) {
                userModel.findById(profile.id, function (error, user) {
                    callback(error, user);
                });
            },
            function (user, callback) {
                if (user && user.id) {
                    user.battleTag = profile.battletag;
                    user.accessToken = accessToken;
                } else {
                    user = {id: profile.id, battleTag: profile.battletag, accessToken: accessToken};
                }
                userModel.upsert(user, function (error) {
                    callback(error,user);
                });

            }
        ], function (error,user) {
            if (error) {
                logger.error(error.message);
                return done(null, false);
            }
            //Set user's id on guild ad
            userService.updateGuildsId(user.id);

            //Set user's id on characters ad
            userService.updateCharactersId(user.id);
            done(null, user);
        });
    }
));

//Define Battlenet Oauth authentication strategy.
passport.use('bnet-parser', new BnetStrategy({
        clientID: config.oauth.bnet.clientID,
        clientSecret: config.oauth.bnet.clientSecret,
        scope: "wow.profile",
        region: config.oauth.bnet.region || "eu",
        callbackURL: config.oauth.bnet.callbackParserURL
    },
    /** @namespace profile.battletag */
    function (accessToken, refreshToken, profile, done) {
        logger.verbose("%s connected", profile.battletag);

        async.waterfall([
            function (callback) {
                userModel.findById(profile.id, function (error, user) {
                    callback(error, user);
                });
            },
            function (user, callback) {
                if (user && user.id) {
                    user.battleTag = profile.battletag;
                    user.accessToken = accessToken;
                } else {
                    user = {id: profile.id, battleTag: profile.battletag, accessToken: accessToken};
                }
                userModel.upsert(user, function (error) {
                    callback(error,user);
                });

            }
        ], function (error,user) {
            if (error) {
                logger.error(error.message);
                return done(null, false);
            }
            //Set user's id on guild ad
            userService.updateGuildsId(user.id);

            //Set user's id on characters ad
            userService.updateCharactersId(user.id);
            done(null, user);
        });
    }
));

// In order to support login sessions, Passport serialize and
// deserialize user instances to and from the session.
// Only the user ID is serialized to the session.
// noinspection JSUnresolvedFunction
passport.serializeUser(function (user, done) {
    logger.silly("serializeUser id:%s battleTag:%s accessToken:%s", user.id, user.battleTag, user.accessToken);
    done(null, user.id);
});

// When subsequent requests are received, the ID is used to find
// the user, which will be restored to req.user.
// noinspection JSUnresolvedFunction
passport.deserializeUser(function (id, done) {
    logger.silly("deserializeUser for id:%s", id);
    userModel.findById(id, function (error, user) {
        if (user) {
            delete user.accessToken;
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

