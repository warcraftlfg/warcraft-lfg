"use strict"


//Module dependencies
var request = require("request");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('/app/config/config.'+env+'.json');


module.exports.getUserCharacters = function(region,accessToken,callback){
    var url = encodeURI("https://"+region+".api.battle.net/wow/user/characters?access_token="+accessToken);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body).characters);
        }
        else{
            if(error)
                callback(new Error(error.message+" on fetching bnet api "+url));
            else
                callback(new Error("Error HTTP "+response.statusCode+" on fetching bnet api "+url));
        }
    })
};

module.exports.getCharacter = function(region,realm,name,callback){
    request(encodeURI("https://"+region+".api.battle.net/wow/character/"+realm+"/"+name+"?fields=guild%2Citem%2Cprogression&locale=en_GB&apikey="+config.oauth.bnet.client_id), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        }
        else{
            if(error)
                callback(new Error(error.message+" on fetching bnet api "+url));
            else
                callback(new Error("Error HTTP "+response.statusCode+" on fetching bnet api "+url));
        }
    });
};

module.exports.getGuild= function(region,realm,name,callback){
    request(encodeURI("https://"+region+".api.battle.net/wow/guild/"+realm+"/"+name+"?fields=members&locale=en_GB&apikey="+config.oauth.bnet.client_id), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        }
        else{
            if(error)
                callback(new Error(error.message+" on fetching bnet api "+url));
            else
                callback(new Error("Error HTTP "+response.statusCode+" on fetching bnet api "+url));
        }
    });
};
