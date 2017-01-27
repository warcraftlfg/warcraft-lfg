"use strict";

//Load dependencies
var request = require("request");
var applicationStorage = process.require("core/applicationStorage.js");

//For some Realms wowprogress is bad ...
var enGBToLocalSlugRealm = {
    "ashenvale": "ясеневыи-лес",
    "azuregos": "азурегос",
    "blackscar": "черныи-шрам",
    "booty-bay": "пиратская-бухта",
    "borean-tundra": "бореиская-тундра",
    "deathguard": "страж-смерти",
    "deathweaver": "ткач-смерти",
    "deepholm": "подземье",
    "eversong": "вечная-песня",
    "fordragon": "дракономор",
    "galakrond": "галакронд",
    "goldrinn": "голдринн",
    "gordunni": "гордунни",
    "greymane": "седогрив",
    "grom": "гром",
    "howling-fjord": "ревущии-фьорд",
    "lich-king": "корольлич",
    "nerzhul": "ner’zhul",
    "razuvious": "разувии",
    "soulflayer": "свежеватель-душ",
    "thermaplugg": "термоштепсель"
};

/**
 * Return the guild ranking from warcraftLogs
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.getRankings = function (region, realm, name, metric, zone, callback) {

    var logger = applicationStorage.logger;
    var config = applicationStorage.config;

    var warcraftlogs = {};

    if (region.toLowerCase() == "eu" && enGBToLocalSlugRealm[realm]) {
        realm = enGBToLocalSlugRealm[realm];
    }
    realm = realm.split(" ").join("-");
    realm = realm.split("'").join("");

    //noinspection JSUnresolvedVariable
    var url = encodeURI("https://www.warcraftlogs.com/v1/parses/character/" + name + "/" + realm + "/" + region + "?metric="+metric+"&zone="+zone+"&api_key=" + config.warcraftLogs.api_key);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                warcraftlogs = JSON.parse(body);
            }
            catch (e) {
                return callback(new Error("WARCRAFTLOGS_API_ERROR"));
            }

            callback(error, warcraftlogs);
        }
        else {
            if (error) {
                logger.error(error.message + " on fetching warcraftlogs api " + url);
            }
            else {
                logger.warn("Error HTTP " + response.statusCode + " on fetching warcraftlogs api " + url);
            }
            callback(new Error("WARCRAFTLOGS_API_ERROR"));
        }
    });
};
