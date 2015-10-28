"use strict"

//Defines dependencies
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var guildService = process.require("services/guildService.js");
var Confine = require("confine");
var async = require("async");

//Configuration
var confine = new Confine();

module.exports.insertOrUpdateBnet = function(region,realm,name,bnet,callback) {

    var database = applicationStorage.getDatabase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in GuildModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildModel'));
        return;
    }


    //Force region to lower case
    region = region.toLowerCase();

    var guild ={}
    guild.region = region;
    guild.realm = realm;
    guild.name = name;
    guild.updated = new Date().getTime();

    bnet.updated=new Date().getTime();

    guild.bnet = bnet;

    database.insertOrUpdate("guilds", {region:region,realm:realm,name:name} ,null ,guild, function(error,result){
        callback(error, result);
    });

};

module.exports.insertOrUpdateAd = function(region,realm,name,id,ad,callback) {
    var database = applicationStorage.getDatabase();

    ad = confine.normalize(ad,guildAdSchema);

    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in GuildAdModel'));
        return;
    }
    if(region == null){
        callback(new Error('Field region is required in GuildAdModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in GuildAdModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildAdModel'));
        return;
    }


    //Force region to lower case
    region = region.toLowerCase();


    var guild ={}
    guild.region = region;
    guild.realm = realm;
    guild.name = name;
    guild.updated = new Date().getTime();

    ad.updated = new Date().getTime();
    guild.ad = ad;

    database.insertOrUpdate("guilds", {region: region, realm: realm, name: name}, {$set: guild, $addToSet: {id: id}}, null, function (error,result) {
        callback(error, result);
    });
};

module.exports.get = function(region,realm,name,callback){
    var database = applicationStorage.getDatabase();
    database.get("guilds",{"region":region,"realm":realm,"name":name},{_id: 0},1,function(error,guild){
        callback(error, guild && guild[0]);
    });
};

module.exports.getLastAds = function (number,filter,callback) {
    var number = number || 10;
    var database = applicationStorage.getDatabase();
    database.search("guilds", {ad:{$exists:true}}, {_id: 0}, number, 1, {updated:-1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.deleteAd = function(region,realm,name,id,callback){
    var database = applicationStorage.getDatabase();
    database.insertOrUpdate("guilds", {region:region,realm:realm,name:name} ,{$unset: {ad:""}}  ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserGuildAds = function(id,callback){
    var database = applicationStorage.getDatabase();
    database.search("guilds", {id:id, ad:{$exists:true}}, {_id: 0}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};



module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('guilds',null,function(error,count){
        callback(error,count);
    });
};


module.exports.getAdsCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('guilds',{ad:{$exists:true}},function(error,count){
        callback(error,count);
    });
};

module.exports.removeId = function(region,realm,name,id, callback) {
    var database = applicationStorage.getDatabase();
    database.insertOrUpdate("guilds", {region: region, realm: realm, name: name}, {$pull: {id: id}}, null, function (error) {
        callback(error);
    });
};

