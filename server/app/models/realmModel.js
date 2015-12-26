"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var async = require('async');

module.exports.insertOrUpdateBnet = function (region,name,connected_realms,bnet,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildUpdateModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildUpdateModel'));
        return;
    }

    //Force region to lower case
    region = region.toLowerCase();

    var realm ={};
    realm.region = region;
    realm.name = name;
    realm.connected_realms = connected_realms;
    realm.updated = new Date().getTime();

    bnet.updated=new Date().getTime();

    realm.bnet = bnet;

    //Create or update guildUpdate
    database.insertOrUpdate("realms", {region:region,name:name} ,null ,realm, function(error,result){
        callback(error, result);
    });
};

module.exports.getFromRealmZones = function(realmZones, callback){
    var database = applicationStorage.getMongoDatabase();

    var criteria = {};
    var realmZonesCriteria = [];
    async.forEach(realmZones,function(realmZone,callback){
        var realmZoneCriteria = {};
        if (realmZone.region){
            realmZoneCriteria.region = realmZone.region.toLowerCase();
        }
        if (realmZone.locale){
            realmZoneCriteria["bnet.locale"] = realmZone.locale;
        }
        if (realmZone.zone && realmZone.cities && realmZone.cities.length > 0){
            var or = [];
            async.forEach(realmZone.cities,function(city,callback){
                or.push({"bnet.timezone":realmZone.zone+"/"+city});
                callback();
            });
            if (or.length > 0) {
                realmZoneCriteria["$or"] = or;
            }
        }
        realmZonesCriteria.push(realmZoneCriteria);
        callback();
    });

    if (realmZonesCriteria.length > 0) {
        criteria["$or"]=realmZonesCriteria;
    }

    database.find("realms",criteria, {name:1,region:1,_id:0}, -1,{name:1,region:1},null, function(error,realms){

        callback(error, realms);
    });
};

module.exports.get = function(region,name, callback){
    var database = applicationStorage.getMongoDatabase();


    database.find("realms",{region:region,name:name}, {name:1,region:1,"connected_realms":1}, -1,{},null, function(error,realms){
        callback(error, realms && realms[0]);
    });
};
