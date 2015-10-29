"use strict";

//Module dependencies
var request = require("request");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");
var cheerio = require("cheerio");
var async = require("async");


//For russian Ream wowprogress is bad ...
var russianRealms = {
    "Гордунни":"Gordunni",
    "Ревущий фьорд":"Howling Fjord",
    "Черный Шрам":"Blackscar",
    "Ясеневый лес":"Ashenvale",
    "Свежеватель Душ":"Soulflayer",
    "Разувий":"Razuvious",
    "Азурегос":"Azuregos",
    "Пиратская Бухта":"Booty Bay",
    "Вечная Песня":"Eversong",
    "Страж смерти":"Deathguard",
    "Король-лич":"Lich King",
    "Дракономор":"Fordragon",
    "Борейская тундра":"Borean Tundra",
    "Голдринн":"Goldrinn",
    "Гром":"Grom",
    "Галакронд":"Galakrond"
};

var languages = {
    "English": "en",
    "German": "de",
    "French": "fr",
    "Spanish": "es",
    "Russian": "ru",
    "Bulgarian": "bg",
    "Chinese": "zh",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Dutch": "nl",
    "Estonian": "et",
    "Finnish": "fi",
    "Greek": "el",
    "Hebrew": "he",
    "Hungarian": "hu",
    "Italian": "it",
    "Japanese": "ja",
    "Korean": "ko",
    "Latvian": "lv",
    "Lithuanian": "lt",
    "Norwegian": "no",
    "Polish": "pl",
    "Portuguese": "pt",
    "Romanian": "ro",
    "Slovenian": "sl",
    "Swedish": "sw",
    "Taiwanese": "tw",
    "Turkish": "tr"
};


module.exports.getWoWProgressPage = function(path,callback) {
    var url = "http://www.wowprogress.com"+path;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(error,body);
        }
        else{
            if(error)
                logger.error(error.message+" on fetching wowprogress api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching wowprogress api "+url);
            callback(new Error("WOWPROGRESS_API_ERROR"));
        }
    });
};

module.exports.getAds = function(callback){
    var self = this;

    this.getWoWProgressPage('/',function(error,body){

        var $body = cheerio.load(body);
        var tables = $body('table.rating.recr').get();

        var $guilds = cheerio.load(tables[0]);
        var guilds = $guilds('tr').get();

        var $characters = cheerio.load(tables[1]);
        var characters = $characters('tr').get();





        var charactersResult = [];
        var guildsResult  = [];
        async.forEach(characters,function(character,callback){
            var $character = cheerio.load(character);
            var url = $character('a').attr('href');
            self.parseCharacterPage(url,function(error,character){
                charactersResult.push(character);
                callback();
            });
        },function(){
            async.forEach(guilds,function(guild,callback){

                var $guild = cheerio.load(guild);
                var url = $guild('a').attr('href');
                var name = $guild('a').text();
                var realm = $guild('.realm').text().split('-')[1];
                var region = $guild('.realm').text().split('-')[0].toLowerCase();
                self.parseGuildPage(region,realm,name,url,function(error,guild){
                    guildsResult.push(guild);
                    callback();
                });

            },function() {
                callback(error,guildsResult,charactersResult);
            });
        });


    });

};

module.exports.parseCharacterPage = function(url,callback) {
    this.getWoWProgressPage(url,function(error,body){
        if (error) {
            callback(error);
            return;
        }
        var result = {};
        var $body = cheerio.load(body);
        result.name = $body('h1').text();

        var realm = $body('.nav_block .nav_link').text().split('-')[1];

        if(russianRealms[realm])
            result.realm = russianRealms[realm];
        else
            result.realm = realm;

        result.region = $body('.nav_block .nav_link').text().split('-')[0].toLowerCase();

        var languageDivs = $body('.language').get();


        var language = cheerio.load(languageDivs[0])('strong').text().split(', ');
        if(languages[language[0]])
            result.language = languages[language];

        var transfert = cheerio.load(languageDivs[1])('span').text();
        if(transfert == "Yes, ready to transfer")
            result.transfert = true;

        var raidsPerWeek = cheerio.load(languageDivs[2])('strong').text().split(' - ');
        result.raids_per_week = {};
        if(raidsPerWeek.indexOf('1')!=-1)
            result.raids_per_week["1_per_week"] = true;
        if(raidsPerWeek.indexOf('2')!=-1)
            result.raids_per_week["2_per_week"] = true;
        if(raidsPerWeek.indexOf('3')!=-1)
            result.raids_per_week["3_per_week"] = true;
        if(raidsPerWeek.indexOf('4')!=-1)
            result.raids_per_week["4_per_week"] = true;
        if(raidsPerWeek.indexOf('5')!=-1)
            result.raids_per_week["5_per_week"] = true;
        if(raidsPerWeek.indexOf('6')!=-1)
            result.raids_per_week["6_per_week"] = true;
        if(raidsPerWeek.indexOf('7')!=-1)
            result.raids_per_week["7_per_week"] = true;


        var roles =  cheerio.load(languageDivs[3])('strong').text().split(', ');
        result.role = {};
        if(roles.indexOf("tank")!=-1)
            result.role.tank = true;
        if(roles.indexOf("dd")!=-1 || raidsPerWeek.indexOf("cac")!=-1)
            result.role.dps = true;
        if(roles.indexOf("healer")!=-1)
            result.role.healer = true;


        result.description = $body('.charCommentary').text();

        callback (null,result);

    });


};

module.exports.parseGuildPage = function(region, realm, name, url, callback) {
    this.getWoWProgressPage(url, function (error, body) {
        if (error) {
            callback(error);
            return;
        }
        var result = {};
        var $body = cheerio.load(body);
        result.region = region.toLowerCase();

        if(russianRealms[realm])
            result.realm = russianRealms[realm];
        else
            result.realm = realm;

        result.name = name;

        var language = $body(".language").text().replace("Primary Language: ","");
        if(languages[language])
            result.language = languages[language];

        var raidsPerWeek = $body(".raids_week").text().replace("Raids per week: ","").split(' - ');
        result.raids_per_week = {};
        if(raidsPerWeek.indexOf('1')!=-1)
            result.raids_per_week["1_per_week"] = true;
        if(raidsPerWeek.indexOf('2')!=-1)
            result.raids_per_week["2_per_week"] = true;
        if(raidsPerWeek.indexOf('3')!=-1)
            result.raids_per_week["3_per_week"] = true;
        if(raidsPerWeek.indexOf('4')!=-1)
            result.raids_per_week["4_per_week"] = true;
        if(raidsPerWeek.indexOf('5')!=-1)
            result.raids_per_week["5_per_week"] = true;
        if(raidsPerWeek.indexOf('6')!=-1)
            result.raids_per_week["6_per_week"] = true;
        if(raidsPerWeek.indexOf('7')!=-1)
            result.raids_per_week["7_per_week"] = true;

        var description = $body(".guildDescription").text();
        result.description = description;

        var website = $body(".website a").attr("href");
        if(website)
            result.website = website;


        callback (null,result);

    });
};
