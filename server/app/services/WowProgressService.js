"use strict";
var wowprogressAPI = process.require('api/wowprogress.js');
var logger = process.require("api/logger.js").get("logger");

module.exports.parseWowProgress = function(){

    wowprogressAPI.getAds(function(error,characterAds){
        if (error){
            logger.error(error.message);
            return;
        }
    });
};