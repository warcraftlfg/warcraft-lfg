"use strict";

//Module dependencies
var request = require("request");
var logger = process.require("api/logger.js").get("logger");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');

module.exports.getRankings = function(region,realm,name,callback) {
    var url=encodeURI("https://www.warcraftlogs.com/v1/rankings/character/"+name+"/"+realm+"/"+region+"?api_key="+config.warcraftLogs.api_key);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else{
            if(error)
                logger.error(error.message+" on fetching warcraftlogs api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching warcraftlogs api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    });
};