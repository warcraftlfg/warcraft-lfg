var User,
    BnetStrategy = require('passport-bnet').Strategy,
    env = process.env.NODE_ENV || 'dev',
    config = require('../config/config.'+env+'.json');



module.exports = {

    bnetStrategy: function(){
        return new BnetStrategy({
                clientID: config.oauth.bnet.client_id,
                clientSecret: config.oauth.bnet.client_secret,
                scope: "wow.profile",
                callbackURL: config.oauth.bnet.callback_url
            },
            function(accessToken, refreshToken, profile, done) {
                console.log(profile);
                return done(null, profile);
            }
        );
    },

    serializeUser: function(user, done) {
        done(null, user);
    },

    deserializeUser: function(obj, done) {
        done(null, obj);
    }

};