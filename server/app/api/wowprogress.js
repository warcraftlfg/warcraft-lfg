"use strict";

//Module dependencies
var request = require("request");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");
var cheerio = require("cheerio");
var async = require("async");

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

module.exports.getAds = function(){
    var self = this;

    this.getWoWProgressPage('/',function(error,body){

        var $body = cheerio.load(body);
        var tables = $body('table.rating.recr').get();

        var $guilds = cheerio.load(tables[0]);
        var guilds = $guilds('tr').get();

        var $characters = cheerio.load(tables[1]);
        var characters = $characters('tr').get();


        guilds.forEach(function(guild){

            var $guild = cheerio.load(guild);
            var name = $guild('a').text();
            var url = $guild('a').attr('href');
            var realm = $guild('.realm').text().split('-')[1];
            var region = $guild('.realm').text().split('-')[0].toLowerCase();

        });


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
            console.log(charactersResult);


        });


    });

};

module.exports.parseCharacterPage = function(url,callback) {
 this.getWoWProgressPage(url,function(error,body){

     var result = {};
     var $body = cheerio.load(body);
     result.name = $body('h1').text();
     result.realm = $body('.nav_block .nav_link').text().split('-')[1];
     result.region = $body('.nav_block .nav_link').text().split('-')[0];
     result.language = $body('.language strong').text();
     callback (null,result);

 });
};

