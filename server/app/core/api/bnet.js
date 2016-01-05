"use strict";

//Module dependencies
var request = require("request");
var applicationStorage = process.require("core/applicationStorage.js");

var config = applicationStorage.config;
var logger = applicationStorage.logger;

/**
 * Get guild information on Bnet API
 * @param region
 * @param realm
 * @param name
 * @param params
 * @param callback
 */
module.exports.getGuild = function(region,realm,name,params,callback){
    var endUrl = "wow/guild/"+realm+"/"+name+"?fields="+params.join(',')+"&locale=en_GB&apikey="+config.oauth.bnet.clientID;
    this.requestBnetApi(region,endUrl,function(error,statusCode){
        callback(error,statusCode);
    });
};

/**
 * Get character information on Bnet API
 * @param region
 * @param realm
 * @param name
 * @param params
 * @param callback
 */
module.exports.getCharacter = function(region,realm,name,params,callback){
    var endUrl = "wow/character/"+realm+"/"+name+"?fields="+params.join(',')+"&locale=en_GB&apikey="+config.oauth.bnet.clientID;
    this.requestBnetApi(region,endUrl,function(error,statusCode){
        callback(error,statusCode);
    });
};

/**
 * Get user's characters on the Bnet API
 * @param region
 * @param accessToken
 * @param callback
 */
module.exports.getUserCharacters = function(region,accessToken,callback){
    var endUrl = "wow/user/characters?access_token="+accessToken;
    this.requestBnetApi(region,endUrl,function(error,result){
        callback(error,result && result.characters);
    });
};

/**
 * Request an URL and return result
 * @param region
 * @param endUrl
 * @param callback
 */
module.exports.requestBnetApi = function(region,endUrl,callback){
    var baseUrl = "https://"+region+".api.battle.net/"
    var url = encodeURI(baseUrl+endUrl);
    request.get({method:"GET",uri:url, gzip: true}, function (error, response, body) {
        if (!error && response.statusCode == 200)
            callback(null,JSON.parse(body));
        else if(!error) {
            var error = new Error("Error HTTP " + response.statusCode + " on fetching bnet api " + url);
            error.name = "BNET_HTTP_ERROR";
            error.statusCode = response.statusCode;
            callback(error);
        }
        else
            callback(error);
    });
};












/*
module.exports.getCharacter = function(region,realm,name,callback){
    var params = ["guild","items","progression","talents","achievements","statistics","challenge","pvp","reputation","stats"];
    this.getCharacterWithParams(region,realm,name,params,function(error,results){
        callback(error,results);
    });
};*/

module.exports.getCharacterWithParams= function(region,realm,name,params,callback){
    var url = encodeURI("https://"+region+".api.battle.net/wow/character/"+realm+"/"+name+"?fields="+params.join(',')+"&locale=en_GB&apikey="+config.oauth.bnet.client_id);
    getCharacter(url,function(error,result){
        callback(error,result);
    });
}





module.exports.getGuildWithParams= function(region,realm,name,params,callback){
    var url = encodeURI("https://"+region+".api.battle.net/wow/guild/"+realm+"/"+name+"?fields="+params.join(',')+"&locale=en_GB&apikey="+config.oauth.bnet.client_id);
    getGuild(url,function(error,results){
        callback(error,results);
    });
}

module.exports.getRealms = function(region,callback){
    var url=encodeURI("https://"+region+".api.battle.net/wow/realm/status?locale=en_GB&apikey="+config.oauth.bnet.client_id);
    request({method:"GET",uri:url, gzip: true},function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else {
            if (error) {
                logger.error(error.message + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_ERROR"));
            }
            if (response.statusCode == 403) {
                logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_ERROR_DENY"));
            }

            logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + url)
            return callback(new Error("BNET_API_ERROR"));
        }
    });
};

module.exports.getAuctions = function(region,realm,callback){
    var url=encodeURI("https://"+region+".api.battle.net/wow/auction/data/"+realm+"?locale=en_GB&apikey="+config.oauth.bnet.client_id);
    request({method:"GET",uri:url, gzip: true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var auctionUrl = encodeURI(JSON.parse(body).files[0].url);
            request(auctionUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(error,JSON.parse(body));
                }
                else {
                    if (error) {
                        logger.error(error.message + " on fetching bnet api " + auctionUrl);
                        return callback(new Error("BNET_API_ERROR"));
                    }
                    if (response.statusCode == 403) {
                        logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + auctionUrl);
                        return callback(new Error("BNET_API_ERROR_DENY"));
                    }

                    logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + auctionUrl)
                    return callback(new Error("BNET_API_ERROR"));
                }
            });
        }
        else {
            if (error) {
                logger.error(error.message + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_ERROR"));
            }
            if (response.statusCode == 403) {
                logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_ERROR_DENY"));
            }

            logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + url)
            return callback(new Error("BNET_API_ERROR"));
        }
    });
};
/*
function getCharacter(url,callback){
    request({method:"GET",uri:url, gzip: true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else {
            if (error) {
                logger.verbose(error.message + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_ERROR"));
            }
            if (response.statusCode == 403) {
                logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_ERROR_DENY"));
            }
            if (response.statusCode == 404) {
                logger.verbose("Error HTTP " + response.statusCode + " on fetching bnet api " + url);
                return callback(new Error("BNET_API_CHARACTER_NOT_FOUND"));
            }

            logger.warn("Error HTTP " + response.statusCode + " on fetching bnet api " + url)
            return callback(new Error("BNET_API_ERROR"));
        }
    });
}*/



