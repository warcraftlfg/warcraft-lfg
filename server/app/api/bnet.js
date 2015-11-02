"use strict";

//Module dependencies
var request = require("request");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");

module.exports.getUserCharacters = function(region,accessToken,callback){
    var url = encodeURI("https://"+region+".api.battle.net/wow/user/characters?access_token="+accessToken);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body).characters);
        }
        else{
            if(error)
                logger.error(error.message+" on fetching bnet api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching bnet api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    })
};

module.exports.getCharacter = function(region,realm,name,callback){
    var url = encodeURI("https://"+region+".api.battle.net/wow/character/"+realm+"/"+name+"?fields=guild,items,progression&locale=en_GB&apikey="+config.oauth.bnet.client_id);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else{
            if(error)
                logger.error(error.message+" on fetching bnet api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching bnet api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    });
};

module.exports.getGuild = function(region,realm,name,callback){
    var url=encodeURI("https://"+region+".api.battle.net/wow/guild/"+realm+"/"+name+"?fields=members&locale=en_GB&apikey="+config.oauth.bnet.client_id);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else{
            if(error)
                logger.error(error.message+" on fetching bnet api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching bnet api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    });
};

module.exports.getRealms = function(region,callback){
    var url=encodeURI("https://"+region+".api.battle.net/wow/realm/status?locale=en_GB&apikey="+config.oauth.bnet.client_id);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else{
            if(error)
                logger.error(error.message+" on fetching bnet api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching bnet api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    });
};

module.exports.getAuctions = function(region,realm,callback){
    var url=encodeURI("https://"+region+".api.battle.net/wow/auction/data/"+realm+"?locale=en_GB&apikey="+config.oauth.bnet.client_id);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var auctionUrl = encodeURI(JSON.parse(body).files[0].url);
            console.log(auctionUrl);
            request(auctionUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(error,JSON.parse(body));
                }
                else{
                    if(error)
                        logger.error(error.message+" on fetching bnet api "+auctionUrl);
                    else
                        logger.warn("Error HTTP "+response.statusCode+" on fetching bnet api "+auctionUrl);
                    callback(new Error("BNET_API_ERROR"));
                }
            });
        }
        else{
            if(error)
                logger.error(error.message+" on fetching bnet api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching bnet api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    });
};

