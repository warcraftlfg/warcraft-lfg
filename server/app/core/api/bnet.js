"use strict";

//Load dependencies
var request = require("request");
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");

/**
 * Get guild information on Bnet API
 * @param region
 * @param realm
 * @param name
 * @param params
 * @param callback
 */
module.exports.getGuild = function (region, realm, name, params, callback) {
    var endUrl = "wow/guild/" + realm + "/" + name + "?fields=" + params.join(',') + "&locale=en_GB&apikey=" + applicationStorage.config.oauth.bnet.clientID;
    this.requestBnetApi(region, endUrl, function (error, statusCode) {
        callback(error, statusCode);
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
module.exports.getCharacter = function (region, realm, name, params, callback) {
    var endUrl = "wow/character/" + realm + "/" + name + "?fields=" + params.join(',') + "&locale=en_GB&apikey=" + applicationStorage.config.oauth.bnet.clientID;
    this.requestBnetApi(region, endUrl, function (error, statusCode) {
        callback(error, statusCode);
    });
};


/**
 * Get user's characters on the Bnet API
 * @param region
 * @param accessToken
 * @param callback
 */
module.exports.getUserCharacters = function (region, accessToken, callback) {
    var endUrl = "wow/user/characters?access_token=" + accessToken;
    this.requestBnetApi(region, endUrl, function (error, result) {
        callback(error, result && result.characters);
    });
};


/**
 * Get the realms from bnet
 * @param region
 * @param callback
 */
module.exports.getRealms = function (region, callback) {
    var endUrl = encodeURI("wow/realm/status?locale=en_GB&apikey=" + applicationStorage.config.oauth.bnet.clientID);
    this.requestBnetApi(region, endUrl, function (error, result) {
        callback(error, result && result.realms);
    });
};


/**
 * Get the auctions for a realm from Bnet
 * @param region
 * @param realm
 * @param callback
 */
module.exports.getAuctions = function (region, realm, callback) {
    var self = this;
    async.waterfall([
        function (callback) {
            var endUrl = encodeURI("wow/auction/data/" + realm + "?locale=en_GB&apikey=" + applicationStorage.config.oauth.bnet.clientID);
            self.requestBnetApi(region, endUrl, function (error, result) {
                var auctionUrl = encodeURI(result.files[0].url);
                callback(error, auctionUrl);
            });
        },
        function (auctionUrl, callback) {
            self.request(auctionUrl, function (error, auctions) {
                //noinspection JSUnresolvedVariable
                callback(error, auctions.auctions);
            })
        }
    ], function (error, auctions) {
        callback(error, auctions)
    });
};


/**
 * Add bnet baseUrl and call request
 * @param region
 * @param endUrl
 * @param callback
 */
module.exports.requestBnetApi = function (region, endUrl, callback) {
    var baseUrl = "https://" + region + ".api.battle.net/";
    var url = encodeURI(baseUrl + endUrl);
    this.request(url, function (error, result) {
        callback(error, result);
    });
};


/**
 * Request an URL and return result
 * @param url
 * @param callback
 */
module.exports.request = function (url, callback) {
    var logger = applicationStorage.logger;
    logger.debug('GET BNET API : %s', url);

    request.get({method: "GET", uri: url, gzip: true}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, JSON.parse(body));
        } else if (!error) {
            logger.error("Error HTTP " + response.statusCode + " on fetching bnet api" + url);
            error = new Error("BNET_HTTP_ERROR");
            error.statusCode = response.statusCode;
            callback(error);
        }
        else {
            callback(error);
        }
    });
};

