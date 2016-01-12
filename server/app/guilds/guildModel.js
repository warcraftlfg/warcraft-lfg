"use strict";

var applicationStorage = process.require("core/applicationStorage.js");
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var guildPermsSchema = process.require('config/db/guildPermsSchema.json');
var Confine = require("confine");

/**
 * Get the guilds
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param callback
 */
module.exports.find = function(criteria,projection,sort,limit,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    if(limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else if(callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    }
};

/**
 * Get one guild
 * @param criteria
 * @param projection
 */
module.exports.findOne = function(criteria,projection,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    collection.findOne(criteria, projection,function (error, guild) {
        callback(error, guild);
    });
};

/**
 * Return the number of guilds
 * @param criteria
 * @param callback
 */
module.exports.count = function(criteria,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    collection.count(criteria,function(error,count){
        callback(error, count);
    });
};

/**
 * Update or insert ad for the guild
 * @param region
 * @param realm
 * @param name
 * @param ad
 * @param callback
 */
module.exports.upsertAd = function(region,realm,name,ad,callback){

    var config = applicationStorage.config;

    //Force region to lowercase
    region = region.toLowerCase();

    //Sanitize ad object
    var confine = new Confine();
    ad = confine.normalize(ad,guildAdSchema);

    if(config.bnetRegions.indexOf(region)==-1){
        return callback(new Error('Region '+ region +' is not allowed in guildModel'));
    }
    if(region == null){
        return callback(new Error('Field region is required in guildModel'));
    }
    if(realm == null){
        return callback(new Error('Field realm is required in guildModel'));
    }
    if(name == null){
        return callback(new Error('Field name is required in guildModel'));
    }

    ad.updated = new Date().getTime();

    var guild ={};
    guild.region = region;
    guild.realm = realm;
    guild.name = name;
    guild.updated = new Date().getTime();
    guild.ad = ad;

    //Upsert
    var collection = applicationStorage.mongo.collection("guilds");
    collection.update({region:region,realm:realm,name:name}, guild, {upsert:true}, function(error,result){
        callback(error,result);
    });
};

/**
 * AddtoSet ID
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.setId = function(region,realm,name,id,callback){

    var config = applicationStorage.config;

    //Force region to lowercase
    region = region.toLowerCase();

    if(config.bnetRegions.indexOf(region)==-1){
        return callback(new Error('Region '+ region +' is not allowed in guildModel'));
    }
    if(region == null){
        return callback(new Error('Field region is required in guildModel'));
    }
    if(realm == null){
        return callback(new Error('Field realm is required in guildModel'));
    }
    if(name == null){
        return callback(new Error('Field name is required in guildModel'));
    }
    if(isNaN(parseInt(id,10))){
        return callback(new Error('Id need to be a number'));
    }

    var collection = applicationStorage.mongo.collection("guilds");
    collection.update({region:region,realm:realm,name:name}, {$addToSet:{id:id}}, {upsert:true}, function(error,result){
        callback(error,result);
    });

};



