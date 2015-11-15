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


module.exports.getGuildRank = function(region,realm,name,callback){

    if(region.toLowerCase() == "eu" && russianRealms[realm])
        realm = russianRealms[realm];

    realm = realm.replace(" ","-");
    realm = realm.replace("'","-");

    var url = encodeURI("http://www.wowprogress.com/guild/"+region+"/"+realm+"/"+name+"/json_rank");
    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            callback(error,JSON.parse(body));
        }
        else{
            if(error)
                logger.error(error.message+" on fetching wowprogress api "+url);
            else
                logger.warn("Error HTTP "+response.statusCode+" on fetching wowprogress api "+url);
            callback(new Error("BNET_API_ERROR"));
        }
    });
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
                self.parseGuildPage(url,function(error,guild){
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
        var armoryUrl = decodeURIComponent(($body('.armoryLink').attr('href')));

        result.name = $body('h1').text();
        result.realm = armoryUrl.match('battle.net/wow/character/(.*)/(.*)/')[1];
        result.region = armoryUrl.match('http://(.*).battle.net/wow/character/')[1];

        var guild = $body('.nav_block .guild nobr').text();
        if (guild)
            result.guild = guild;

        var languageDivs = $body('.language').get();

        var language = cheerio.load(languageDivs[0])('strong').text().split(', ');
        if(languages[language[0]])
            result.language = languages[language[0]];

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

module.exports.parseGuildPage = function( url, callback) {
    var self=this;
    this.getWoWProgressPage(url, function (error, body) {
        if (error) {
            callback(error);
            return;
        }
        var result = {};
        var $body = cheerio.load(body);

        var armoryUrl = decodeURIComponent(($body('.armoryLink').attr('href')));

        result.name = $body('h1').text().match("“(.*)” WoW Guild")[1];
        result.realm = armoryUrl.match('battle.net/wow/guild/(.*)/(.*)/')[1];
        result.region = armoryUrl.match('http://(.*).battle.net/wow/guild/')[1];

        var language = $body(".language").text().replace("Primary Language: ","");
        if(languages[language])
            result.language = languages[language];

        var recrAll = $body(".recrClasses .recrAll").text();
        if(recrAll == "all classes") {
            result.recruitment = self.formatRecruitment(true);
        }
        else {
            result.recruitment = self.formatRecruitment(false);
            $body(".recrClasses tr").each(function(i, elem) {
                var line = cheerio(this).text();
                if(line.indexOf("deathknight")!=-1){
                    if(line.indexOf("(dd)")!=-1)
                        result.recruitment.melee_dps.deathknight = true;
                    else if(line.indexOf("(tank)")!=-1)
                        result.recruitment.tanks.deathknight = true;
                    else {
                        result.recruitment.melee_dps.deathknight = true;
                        result.recruitment.tanks.deathknight = true;
                    }
                }
                if(line.indexOf("druid")!=-1){
                    if(line.indexOf("(balance)")!=-1)
                        result.recruitment.ranged_dps.druid = true;
                    else if(line.indexOf("(restoration)")!=-1)
                        result.recruitment.heals.druid = true;
                    else if(line.indexOf("(feral-dd)")!=-1)
                        result.recruitment.melee_dps.druid = true;
                    else if(line.indexOf("(feral-tank)")!=-1)
                        result.recruitment.tanks.druid = true;
                    else {
                        result.recruitment.ranged_dps.druid = true;
                        result.recruitment.heals.druid = true;
                        result.recruitment.melee_dps.druid = true;
                        result.recruitment.tanks.druid = true;
                    }
                }
                if(line.indexOf("hunter")!=-1){
                    result.recruitment.ranged_dps.hunter = true;
                }
                if(line.indexOf("mage")!=-1){
                    result.recruitment.ranged_dps.mage = true;
                }
                if(line.indexOf("monk")!=-1){
                    if(line.indexOf("(healer)")!=-1)
                        result.recruitment.heals.monk = true;
                    else if(line.indexOf("(dd)")!=-1)
                        result.recruitment.melee_dps.monk = true;
                    else if(line.indexOf("(tank)")!=-1)
                        result.recruitment.tanks.monk = true;
                    else {
                        result.recruitment.heals.monk = true;
                        result.recruitment.melee_dps.monk = true;
                        result.recruitment.tanks.monk = true;
                    }
                }
                if(line.indexOf("paladin")!=-1){
                    if(line.indexOf("(holy)")!=-1)
                        result.recruitment.heals.paladin = true;
                    else if(line.indexOf("(retribution)")!=-1)
                        result.recruitment.melee_dps.paladin = true;
                    else if(line.indexOf("(protection)")!=-1)
                        result.recruitment.tanks.paladin = true;
                    else {
                        result.recruitment.heals.paladin = true;
                        result.recruitment.melee_dps.paladin = true;
                        result.recruitment.tanks.paladin = true;
                    }
                }
                if(line.indexOf("priest")!=-1){
                    if(line.indexOf("(dd)")!=-1)
                        result.recruitment.ranged_dps.priest = true;
                    else if(line.indexOf("(healer)")!=-1) {
                        result.recruitment.heals.priest_discipline = true;
                        result.recruitment.heals.priest_holy = true;
                    }
                    else {
                        result.recruitment.ranged_dps.priest = true;
                        result.recruitment.heals.priest_discipline = true;
                        result.recruitment.heals.priest_holy = true;
                    }
                }
                if(line.indexOf("rogue")!=-1){
                    result.recruitment.melee_dps.rogue = true;
                }
                if(line.indexOf("shaman")!=-1){
                    if(line.indexOf("(elemental)")!=-1)
                        result.recruitment.ranged_dps.shaman = true;
                    else if(line.indexOf("(restoration)")!=-1)
                        result.recruitment.heals.shaman = true;
                    else if(line.indexOf("(enhancement)")!=-1)
                        result.recruitment.melee_dps.shaman = true;
                    else {
                        result.recruitment.ranged_dps.shaman = true;
                        result.recruitment.heals.shaman = true;
                        result.recruitment.melee_dps.shaman = true;
                    }
                }
                if(line.indexOf("warlock")!=-1){
                    result.recruitment.ranged_dps.warlock = true;
                }
                if(line.indexOf("warrior")!=-1){
                    if(line.indexOf("(dd)")!=-1)
                        result.recruitment.melee_dps.warrior = true;
                    else if(line.indexOf("(tank)")!=-1)
                        result.recruitment.tanks.warrior = true;
                    else {
                        result.recruitment.melee_dps.warrior = true;
                        result.recruitment.tanks.warrior = true;
                    }
                }
            });
        }

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

module.exports.formatRecruitment= function(defaultValue){
    return {
        tanks: {
            warrior:defaultValue,
            druid:defaultValue,
            paladin:defaultValue,
            monk:defaultValue
        },
        heals: {
            druid:defaultValue,
            priest_discipline:defaultValue,
            priest_holy:defaultValue,
            paladin:defaultValue,
            chaman:defaultValue,
            monk:defaultValue
        },
        melee_dps: {
            druid:defaultValue,
            deathknight:defaultValue,
            paladin:defaultValue,
            monk:defaultValue,
            shaman:defaultValue,
            warrior:defaultValue,
            rogue:defaultValue
        },
        ranged_dps: {
            priest:defaultValue,
            shaman:defaultValue,
            hunter:defaultValue,
            warlock:defaultValue,
            mage:defaultValue
        }
    };
};
