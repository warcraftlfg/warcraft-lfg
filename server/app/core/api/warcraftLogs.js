"use strict";

//Load dependencies
var request = require("request");
var applicationStorage = process.require("core/applicationStorage.js");

//For russian Ream wowprogress is bad ...
var russianRealms = {
    "Gordunni": "Гордунни",
    "Howling Fjord": "Ревущий фьорд",
    "Blackscar": "Черный Шрам",
    "Ashenvale": "Ясеневый лес",
    "Soulflayer": "Свежеватель Душ",
    "Razuvious": "Разувий",
    "Azuregos": "Азурегос",
    "Booty Bay": "Пиратская Бухта",
    "Eversong": "Вечная Песня",
    "Deathguard": "Страж смерти",
    "Lich King": "Король-лич",
    "Fordragon": "Дракономор",
    "Borean Tundra": "Борейская тундра",
    "Goldrinn": "Голдринн",
    "Grom": "Гром",
    "Galakrond": "Галакронд"
};

var frenchRealms = {
    "Arak-arahm": "arakarahm",
    "Arathi": "arathi",
    "Archimonde": "archimonde",
    "Chants éternels": "chants-eternels",
    "Cho'gall": "cho’gall",
    "Confrérie du Thorium": "confrerie-du-thorium",
    "Conseil des Ombres": "conseil-des-ombres",
    "Culte de la Rive noire": "culte-de-la-rive-noire",
    "Dalaran": "dalaran",
    "Drek'Thar": "drekthar",
    "Eitrigg": "eitrigg",
    "Eldre'Thalas": "eldrethalas",
    "Elune": "elune",
    "Garona": "garona",
    "Hyjal": "hyjal",
    "Illidan": "illidan",
    "Kael'thas": "kaelthas",
    "Khaz Modan": "khaz-modan",
    "Kirin Tor": "kirin-tor",
    "Krasus": "krasus",
    "La Croisade écarlate": "la-croisade-ecarlate",
    "Les Clairvoyants": "les-clairvoyants",
    "Les Sentinelles": "les-sentinelles",
    "Marécage de Zangar": "marecage-de-zangar",
    "Medivh": "medivh",
    "Naxxramas": "naxxramas",
    "Ner'zhul": "ner’zhul",
    "Rashgarroth": "rashgarroth",
    "Sargeras": "sargeras",
    "Sinstralis": "sinstralis",
    "Temple noir": "temple-noir",
    "Throk'Feroth": "throkferoth",
    "Uldaman": "uldaman",
    "Varimathras": "varimathras",
    "Vol'jin": "voljin",
    "Ysondre": "ysondre"
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

    if (region.toLowerCase() == "eu" && russianRealms[realm]) {
        realm = russianRealms[realm];
    }

    if (region.toLowerCase() == "eu" && frenchRealms[realm]) {
        realm = frenchRealms[realm];
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
