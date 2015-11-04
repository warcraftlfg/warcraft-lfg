"use strict"

//Defines dependencies
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");
var async = require("async");

//Configuration
var confine = new Confine();
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");


module.exports.insertOrUpdateWowProgress = function(region,realm,name,wowProgress,callback) {

    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
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

    var guild ={};
    guild.region = region;
    guild.realm = realm;
    guild.name = name;
    guild.updated = new Date().getTime();

    wowProgress.updated=new Date().getTime();

    guild.wowProgress = wowProgress;

    database.insertOrUpdate("guilds", {region:region,realm:realm,name:name} ,null ,guild, function(error,result){
        callback(error, result);
    });

};


module.exports.insertOrUpdateBnet = function(region,realm,name,bnet,callback) {

    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
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

    var guild ={};
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
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    ad = confine.normalize(ad,guildAdSchema);

    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in GuildAdModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
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

    var guild ={};
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

module.exports.setId = function(region,realm,name,id,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();


    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in GuildAdModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
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

    var guild ={};
    guild.region = region;
    guild.realm = realm;
    guild.name = name;
    database.insertOrUpdate("guilds", {region: region, realm: realm, name: name}, {$set: guild, $addToSet: {id: id}}, null, function (error,result) {
        callback(error, result);
    });
};



module.exports.get = function(region,realm,name,callback){
    var database = applicationStorage.getMongoDatabase();
    database.get("guilds",{"region":region,"realm":realm,"name":name},{_id: 0},1,function(error,guild){
        callback(error, guild && guild[0]);
    });
};

module.exports.getAds = function (number,filters,callback) {
    var number = number || 10;
    var database = applicationStorage.getMongoDatabase();
    var criteria ={ad:{$exists:true}};
    var filters = filters || {};
    if(filters.last){
        criteria.updated={$lt:filters.last}
    }
    database.search("guilds", criteria, {
        name:1,
        realm:1,
        region:1,
        "ad":1,
        "bnet.side":1
    }, number, {"ad.updated":-1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.getLastAds = function (callback) {
    var database = applicationStorage.getMongoDatabase();
    database.search("guilds", {ad:{$exists:true}},{name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1}, 5, {"ad.updated":-1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.deleteAd = function(region,realm,name,id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("guilds", {region:region,realm:realm,name:name} ,{$unset: {ad:""}}  ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.deleteOldAds = function(timestamp,callback){
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("guilds", {"ad.updated":{$lte:timestamp}} ,{$unset: {ad:""}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserAds = function(id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.search("guilds", {id:id, ad:{$exists:true}}, {name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1}, 0,{updated:-1}, function(error,result){
        callback(error, result);
    });
};



module.exports.getCount = function (callback){
    var database = applicationStorage.getMongoDatabase();
    database.count('guilds',null,function(error,count){
        callback(error,count);
    });
};


module.exports.getAdsCount = function (callback){
    var database = applicationStorage.getMongoDatabase();
    database.count('guilds',{ad:{$exists:true}},function(error,count){
        callback(error,count);
    });
};

module.exports.removeId = function(region,realm,name,id, callback) {
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("guilds", {region: region, realm: realm, name: name}, {$pull: {id: id}}, null, function (error) {
        callback(error);
    });
};

