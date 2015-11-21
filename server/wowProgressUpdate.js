"use strict"

// Set module root directory and define a custom require function
process.root = __dirname;
process.require = function(filePath){
    return require(path.normalize(process.root + "/app/" + filePath));
};

// Module dependencies
var path = require("path");
var async = require('async');
var MongoDatabase = process.require("api/MongoDatabase.js");
var RedisDatabase = process.require("api/RedisDatabase.js");

var applicationStorage = process.require("api/applicationStorage");

var guildAdSchema = process.require('config/db/guildAdSchema.json');
var characterAdSchema = process.require('config/db/characterAdSchema.json');

var Confine = require("confine");

//Configuration
var confine = new Confine();

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var loggerAPI = process.require("api/logger.js");
var logger = loggerAPI.get("logger",config.logger)
var wowprogressAPI = process.require('api/wowProgress.js');
var guildModel = process.require("models/guildModel.js");
var characterModel = process.require("models/characterModel.js");


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

async.series([
    // Establish a connection to the database
    function(callback) {

        var mongoDb = new MongoDatabase(config.database.mongodb);
        var redisDb = new RedisDatabase(config.database.redis);
        // Establish connection to the database

        mongoDb.connect(function(error) {
            if (error) {
                console.log(error.message);
                process.exit(0);
            }

            applicationStorage.setMongoDatabase(mongoDb);

            redisDb.connect(function(error) {
                if (error) {
                    console.log(error.message);
                    process.exit(0);
                }
                applicationStorage.setRedisDatabase(redisDb);

                callback();

            });


        });
    },
    // Start Guild update
    function(callback){
        var database = applicationStorage.getMongoDatabase();

        database.find("guilds", {"ad.updated":{$exists:true}},{name:1,realm:1,region:1,"ad.updated":1,id:1}, -1, {"ad.updated":-1}, function(error,guilds){
            //callback(error, guilds);
            //FOREACH GUILD GET WOWPROGRESS INFO ET SET THEM
            async.eachSeries(guilds,function(guild,callback){
                if(guild.id.indexOf(0)!=-1){

                    var realm = "";
                    if(russianRealms[guild.realm] && guild.region =="eu")
                        realm = russianRealms[guild.realm];
                    else
                        realm = guild.realm;

                    realm = realm.split(" ").join("-");
                    realm = realm.split("'").join("-");

                    wowprogressAPI.parseGuildPage(encodeURI("/guild/"+guild.region+"/"+realm+"/"+guild.name),function(error,guildAd){

                        if(error)
                            return callback();
                        var date = guild.ad.updated;
                        guildAd = confine.normalize(guildAd,guildAdSchema);

                        guild.ad = guildAd;
                        guild.ad.updated = date;
                        console.log(guild);
                        database.insertOrUpdate("guilds", {region: guild.region, realm: guild.realm, name: guild.name},null , guild, function (error,result) {
                            callback(error, result);
                        });

                    });

                }
                else{
                    console.log(guild.id);
                    callback()
                }
            },function(){
                callback();
            });
        },function(){
            callback();
        });




    },
    // Start Characters update
    function(callback) {
        //console.log(characters);
        //FOREACH GUILD GET WOWPROGRESS INFO ET SET THEM

        var database = applicationStorage.getMongoDatabase();

        database.find("characters", {"ad.updated": {$exists: true}}, {
            name: 1,
            realm: 1,
            region: 1,
            "ad.updated": 1,
            id: 1
        }, 0, {"ad.updated": -1}, function (error, characters) {
            callback(error, characters);

            async.eachSeries(characters, function (character, callback) {
                if (character.id == 0) {

                    var realm = "";
                    if (russianRealms[character.realm] && character.region == "eu")
                        realm = russianRealms[character.realm];
                    else
                        realm = character.realm;

                    realm = realm.split(" ").join("-");
                    realm = realm.split("'").join("-");

                    wowprogressAPI.parseCharacterPage(encodeURI("/character/" + character.region + "/" + realm + "/" + character.name), function (error, characterAd) {
                        characterAd = confine.normalize(characterAd,characterAdSchema);

                        var date = character.ad.updated;
                        character.ad = characterAd;
                        character.ad.updated = date;

                        console.log(character);
                        database.insertOrUpdate("characters", {
                            region: character.region,
                            realm: character.realm,
                            name: character.name
                        }, null, character, function (error, result) {
                            callback(error, result);
                        });

                    });

                }
                else {
                    console.log(character.id);
                    callback();
                }
            });
        }, function () {
            callback();
        });
    }

]);