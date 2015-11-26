"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");

//Configuration
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");


module.exports.insertOrUpdate = function(region,realm,name,raid,boss,difficulty,timestamp,progress,callback) {

    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildKillModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in GuildKillModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildKillModel'));
        return;
    }

    var guildKill ={};
    guildKill.region = region;
    guildKill.realm = realm;
    guildKill.name = name;
    guildKill.boss = boss;
    guildKill.difficulty  = difficulty;
    guildKill.timestamp = timestamp;

    database.insertOrUpdate(raid, {region:region,realm:realm,name:name,boss:boss,difficulty:difficulty,timestamp:timestamp,"roster.name":{$ne:progress.name}} ,{$push:{roster:progress}} ,null, function(error,result){
        callback(error, result);
    });
};
