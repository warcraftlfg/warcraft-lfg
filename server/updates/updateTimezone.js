//This script update timezone for character & guild before 2016/02/08 01h00 GMT with realm timezone

process.root = __dirname;
process.require = function (filePath) {
    return require(path.normalize(process.root + "/../app/" + filePath));
};

var path = require("path");
var async = require('async');
var mongo = require('mongodb').MongoClient;
var guildModel = process.require('guilds/guildModel.js');
var characterModel = process.require('characters/characterModel.js');
var realmModel = process.require('realms/realmModel.js');
var applicationStorage = process.require("core//applicationStorage");
var config = process.require("config/config.json");
applicationStorage.config = config;

async.waterfall([
    function (callback) {
        mongo.connect(config.database.mongo, function (error, db) {
            applicationStorage.mongo = db;
            callback(error);
        });
    },
    function (callback) {
        console.log('----------------GUILDS----------------');
        var date = 1454886000000;
        guildModel.find({
            "ad.lfg": true,
            "ad.updated": {$lte: date}
        }, {"ad": 1, region: 1, realm: 1, name: 1}, {"ad": 1}, 0, {"ad.lfg": 1}, function (error, guilds) {
            callback(error, guilds);
        });
    },
    function (guilds, callback) {
        async.each(guilds, function (guild, callback) {
            realmModel.find({region: guild.region, name: guild.realm}, {
                "bnet.timezone": 1,
                "bnet.locale": 1
            }, function (error, realm) {

                if (realm[0].bnet.timezone == "Europe/Paris") {
                    if (realm[0].bnet.locale == "en_GB")
                        guild.ad.timezone = "Europe/London";
                    else if (realm[0].bnet.locale == "de_DE")
                        guild.ad.timezone = "Europe/Berlin";
                    else if (realm[0].bnet.locale == "es_ES")
                        guild.ad.timezone = "Europe/Madrid";
                    else if (realm[0].bnet.locale == "pt_BR")
                        guild.ad.timezone = "Europe/Lisbon";
                    else if (realm[0].bnet.locale == "ru_RU")
                        guild.ad.timezone = "Europe/Moscow";
                    else
                        guild.ad.timezone = realm[0].bnet.timezone;

                } else {
                    guild.ad.timezone = realm[0].bnet.timezone;
                }
                var obj = {};
                obj.ad = guild.ad;

                guildModel.upsert(guild.region, guild.realm, guild.name, obj, function (error) {
                    console.log("Update " + guild.region + "-" + guild.realm + "-" + guild.name + " to " + guild.ad.timezone);
                    callback();
                });
            });

        }, function (error) {
            callback();
        });
    },function (callback) {
        console.log('----------------CHARACTERS----------------');
        var date = 1454886000000;
        characterModel.find({
            "ad.lfg": true,
            "ad.updated": {$lte: date}
        }, {"ad": 1, region: 1, realm: 1, name: 1}, {"ad": 1}, 0, {"ad.lfg": 1}, function (error, characters) {
            callback(error, characters);
        });
    },
    function (characters, callback) {
        async.each(characters, function (character, callback) {
            realmModel.find({region: character.region, name: character.realm}, {
                "bnet.timezone": 1,
                "bnet.locale": 1
            }, function (error, realm) {

                if (realm[0].bnet.timezone == "Europe/Paris") {
                    if (realm[0].bnet.locale == "en_GB")
                        character.ad.timezone = "Europe/London";
                    else if (realm[0].bnet.locale == "de_DE")
                        character.ad.timezone = "Europe/Berlin";
                    else if (realm[0].bnet.locale == "es_ES")
                        character.ad.timezone = "Europe/Madrid";
                    else if (realm[0].bnet.locale == "pt_BR")
                        character.ad.timezone = "Europe/Lisbon";
                    else if (realm[0].bnet.locale == "ru_RU")
                        character.ad.timezone = "Europe/Moscow";
                    else
                        character.ad.timezone = realm[0].bnet.timezone;

                } else {
                    character.ad.timezone = realm[0].bnet.timezone;
                }
                var obj = {};
                obj.ad = character.ad;

                characterModel.upsert(character.region, character.realm, character.name, obj, function (error) {
                    console.log("Update " + character.region + "-" + character.realm + "-" + character.name + " to " + character.ad.timezone);
                    callback();
                });
            });

        }, function (error) {
            callback();
        });
    }
]);


