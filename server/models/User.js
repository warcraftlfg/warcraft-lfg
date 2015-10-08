var User,
    BnetStrategy = require('passport-bnet').Strategy,
    env = process.env.NODE_ENV || 'dev',
    config = require('../config/config.'+env+'.json');



module.exports = {

    findOrCreateOauthUser: function(req, id, battletag, accessToken, callback) {
    },

    bnetStrategy: function(){
        return new BnetStrategy({
                clientID: config.oauth.bnet.client_id,
                clientSecret: config.oauth.bnet.client_secret,
                scope: "wow.profile",
                callbackURL: config.oauth.bnet.callback_url
            },
            function(accessToken, refreshToken, profile, done) {
                module.exports.findOrCreateOauthUser(req,profile.id,profile.battletag,profile.accessToken,function(user){
                    return done(null, user);
                });
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