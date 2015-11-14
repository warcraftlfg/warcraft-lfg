"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var async = require('async');

module.exports.insertOrUpdateBnet = function (region,name,bnet,callback) {
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
    realm.updated = new Date().getTime();

    bnet.updated=new Date().getTime();

    realm.bnet = bnet;

    //Create or update guildUpdate
    database.insertOrUpdate("realms", {region:region,name:name} ,null ,realm, function(error,result){
        callback(error, result);
    });
};

module.exports.search = function(search, callback) {
    if(!search || search.length <2){
        callback(new Error('Field search is required with 2 or more characters'));
        return;
    }

    var database = applicationStorage.getMongoDatabase();
    database.find("realms", {
        name:{$regex:"^"+search+".*",$options:"i"}
    }, {name:1,realm:1,region:1,"bnet.class":1}, 9,{}, function(error,result){
        callback(error, result);
    });
};


