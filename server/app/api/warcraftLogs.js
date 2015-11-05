"use strict";

//Module dependencies
var request = require("request");
var logger = process.require("api/logger.js").get("logger");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');


//For russian Ream wowprogress is bad ...
var russianRealms = {
    "Gordunni":"Гордунни",
    "Howling Fjord":"Ревущий фьорд",
    "Blackscar":"Черный Шрам",
    "Ashenvale":"Ясеневый лес",
    "Soulflayer":"Свежеватель Душ",
    "Razuvious":"Разувий",
    "Azuregos":"Азурегос",
    "Booty Bay":"Пиратская Бухта",
    "Eversong":"Вечная Песня",
    "Deathguard":"Страж смерти",
    "Lich King":"Король-лич",
    "Fordragon":"Дракономор",
    "Borean Tundra":"Борейская тундра",
    "Goldrinn":"Голдринн",
    "Grom":"Гром",
    "Galakrond":"Галакронд"
};

module.exports.getRankings = function(region,realm,name,callback) {

    if(region.toLowerCase() == "eu" && russianRealms[realm])
        realm = russianRealms[realm];

    realm = realm.replace(" ","-");

    var url=encodeURI("https://www.warcraftlogs.com/v1/rankings/character/"+name+"/"+realm+"/"+region+"?api_key="+config.warcraftLogs.api_key);

    console.log(url);
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
