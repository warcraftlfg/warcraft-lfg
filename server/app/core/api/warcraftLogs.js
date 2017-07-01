"use strict";

//Load dependencies
var request = require("request");
var applicationStorage = process.require("core/applicationStorage.js");

//For some Realms wowprogress is bad ...
var enGBToLocalSlugRealmEU = {
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

var enGBToLocalSlugRealmTW = {
    "arthas": "阿薩斯",
    "arygos": "亞雷戈斯",
    "bleeding-hollow": "血之谷",
    "chillwind-point": "冰風崗哨",
    "crystalpine-stinger": "水晶之刺",
    "demon-fall-canyon": "屠魔山谷",
    "dragonmaw": "巨龍之喉",
    "frostmane": "冰霜之刺",
    "hellscream": "地獄吼",
    "icecrown": "寒冰皇冠",
    "lights-hope": "聖光之願",
    "menethil": "米奈希爾",
    "nightsong": "夜空之歌",
    "order-of-the-cloud-serpent": "雲蛟衛",
    "queldorei": "眾星之子",
    "shadowmoon": "暗影之月",
    "silverwing-hold": "銀翼要塞",
    "skywall": "天空之牆",
    "spirestone": "尖石",
    "stormscale": "雷鱗",
    "sundown-marsh": "日落沼澤",
    "whisperwind": "語風",
    "world-tree": "世界之樹",
    "wrathbringer": "憤怒使者",
    "zealot-blade": "狂熱之刃"
};

var enGBToLocalSlugRealmKR = {
    "alexstrasza": "알렉스트라자",
    "azshara": "아즈샤라",
    "burning-legion": "불타는-군단",
    "cenarius": "세나리우스",
    "dalaran": "달라란",
    "deathwing": "데스윙",
    "durotan": "듀로탄",
    "garona": "가로나",
    "guldan": "굴단",
    "hellscream": "헬스크림",
    "hyjal": "하이잘",
    "malfurion": "말퓨리온",
    "norgannon": "노르간논",
    "rexxar": "렉사르",
    "stormrage": "스톰레이지",
    "wildhammer": "와일드해머",
    "windrunner": "윈드러너",
    "zuljin": "줄진"
};

/**
 * Return the guild ranking from warcraftLogs
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.getRankings = function (region, realm, name, metric, zone, partition, callback) {

    var logger = applicationStorage.logger;
    var config = applicationStorage.config;

    var warcraftlogs = {};

    if (region.toLowerCase() == "eu" && enGBToLocalSlugRealmEU[realm]) {
        realm = enGBToLocalSlugRealmEU[realm];
    }
    else if (region.toLowerCase() == "tw" && enGBToLocalSlugRealmTW[realm]) {
        realm = enGBToLocalSlugRealmTW[realm];
    }
    else if (region.toLowerCase() == "kr" && enGBToLocalSlugRealmKR[realm]) {
        realm = enGBToLocalSlugRealmKR[realm];
    }
    
    realm = realm.split(" ").join("-");
    realm = realm.split("'").join("");

    //noinspection JSUnresolvedVariable
    var url = encodeURI("https://www.warcraftlogs.com/v1/parses/character/" + name + "/" + realm + "/" + region + "?metric="+metric+"&zone="+zone+"&partition="+partition+"&api_key=" + config.warcraftLogs.api_key);

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
