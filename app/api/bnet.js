"use strict"


//Module dependencies
var request = require("request");

module.exports.getUserCharacters = function(region,accessToken,callback){
    request("https://"+region+".api.battle.net/wow/user/characters?access_token="+accessToken, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(JSON.parse(body).characters);
        }
    })
}