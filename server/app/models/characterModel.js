"use strict";

//Module dependencies
var async = require("async");
var characterAdSchema = process.require('config/db/characterAdSchema.json');
var applicationStorage = process.require("api/applicationStorage.js");
var Confine = require("confine");
var ObjectID = require('mongodb').ObjectID;
//Configuration
var confine = new Confine();
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");


module.exports.insertOrUpdateWarcraftLogs = function(region,realm,name,warcraftLogs,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if (region == null) {
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if (config.bnet_regions.indexOf(region) == -1) {
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if (name == null) {
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }

    var character ={};
    character.region = region;
    character.realm = realm;
    character.name = name;
    character.updated = new Date().getTime();


    character.warcraftLogs = {};
    character.warcraftLogs.updated = new Date().getTime();
    character.warcraftLogs.logs = warcraftLogs;

    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
        callback(error, result);
    });

};

module.exports.insertOrUpdateBnet = function(region,realm,name,bnet,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if (region == null) {
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if (config.bnet_regions.indexOf(region) == -1) {
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if (name == null) {
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }

    var character ={};
    character.region = region;
    character.realm = realm;
    character.name = name;
    character.updated = new Date().getTime();

    bnet.updated=new Date().getTime();

    character.bnet = bnet;

    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
        callback(error, result);
    });

};

module.exports.insertOrUpdatePveScore = function(region,realm,name, progress,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if (region == null) {
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if (config.bnet_regions.indexOf(region) == -1) {
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if (name == null) {
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }

    var character ={};
    character.region = region;
    character.realm = realm;
    character.name = name;
    character.updated = new Date().getTime();

    character.progress = progress;

    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
        callback(error, result);
    });

};


module.exports.insertOrUpdateAd = function(region,realm,name,id,ad,callback) {

    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Normalize before insert
    ad = confine.normalize(ad,characterAdSchema);

    //Check for required attributes
    if (id == null) {
        callback(new Error('Field id is required in CharacterModel'));
        return;
    }
    if (config.bnet_regions.indexOf(region) == -1) {
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (region == null) {
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if (name == null) {
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }


    var character ={};
    character.region = region;
    character.realm = realm;
    character.name = name;
    character.id = id;
    character.updated = new Date().getTime();

    ad.updated = new Date().getTime();
    character.ad = ad;
    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
        callback(error, result);
    });

};

module.exports.setId = function(region,realm,name,id,callback){

    var database = applicationStorage.getMongoDatabase();

    //Check for required attributes
    if (id == null) {
        callback(new Error('Field id is required in CharacterModel'));
        return;
    }
    if (config.bnet_regions.indexOf(region) == -1) {
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (region == null) {
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if (name == null) {
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }
    var character = {};
    character.region = region;
    character.realm = realm;
    character.name = name;
    character.id = id;
    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
        callback(error, result);
    });

};

module.exports.get = function(region,realm,name,callback){
    var database = applicationStorage.getMongoDatabase();
    database.get("characters", {
        "region":region,
        "realm":realm,
        "name":name
    }, {
        id:1,
        region:1,
        realm:1,
        name:1,
        ad:1,
        updated:1,
        "bnet.faction":1,
        "bnet.class":1,
        "bnet.thumbnail":1,
        "bnet.guild.name":1,
        "bnet.race":1,
        "bnet.level":1,
        "bnet.talents":1,
        "bnet.progression.raids":{$slice:-1},
        "bnet.items":1,
        "bnet.reputation":1,
        "bnet.achievements":1,
        "bnet.challenge.records":1,
        "warcraftLogs.logs":1
    }, 1, function(error,character){
        var result = undefined;
        if(character && character[0]){
            result =  character[0];
            result.ad = confine.normalize(result.ad,characterAdSchema);
        }
        callback(error, result);
    });
};

module.exports.getAds = function(number, filters, callback) {
    var number = number || 10;
    var database = applicationStorage.getMongoDatabase();
    var criteria ={"ad.lfg":true};
    var filters = filters || {};
    var sort = {};
    var raid = config.progress.raids[0];

    // Filter
    var or = [];
    if (filters.lvlmax) {
        criteria["bnet.level"] = {$gte:100};
    }

    if (filters.faction) {
        criteria["bnet.faction"] = parseInt(filters.faction,10);
    }

    if (filters.transfert) {
        criteria["ad.transfert"] = filters.transfert;
    }

    if (filters.languages && filters.languages.length>0) {
        var languages = [];
        filters.languages.forEach(function(item){
            languages.push(item.id);
        });
        criteria["ad.languages"] = { $in: languages};
    }

    if (filters.classes && filters.classes.length>0 && filters.classes.length < 11) {
        var classes = [];
        filters.classes.forEach(function(item) {
            classes.push(item.id);
        });
        criteria["bnet.class"] = { $in: classes};
    }

    if (filters.roles && filters.roles.length > 0) {
        var roles = []
        filters.roles.forEach(function(role){
            var tmpObj = {};
            tmpObj["ad.role."+role.id] = true;
            roles.push(tmpObj);
        });
        or.push(roles);
    }

    if (filters.days && filters.days.length>0) {
        filters.days.forEach(function(day){
            var tmpObj = {};
            criteria["ad.play_time."+day.id+".play"] = true;
        });
    }

    if (filters.raids_per_week && filters.raids_per_week.active) {
        criteria["ad.raids_per_week.min"] = {$lte:parseInt(filters.raids_per_week.min,10)};
        criteria["ad.raids_per_week.max"] = {$gte:parseInt(filters.raids_per_week.max,10)};
    }

    if (filters.ilevel && filters.ilevel.active) {
        criteria["bnet.items.averageItemLevelEquipped"] = {$lte:parseInt(filters.ilevel.max,10), $gte:parseInt(filters.ilevel.min,10)};
    }

    if (filters.progress && filters.progress.active) {
        var progressFactor;
        if (filters.progress.difficulty == "lfr") {
            progressFactor = 10;
        } else if (filters.progress.difficulty == "normal") {
            progressFactor = 1000;
        } else if (filters.progress.difficulty == "heroic") {
            progressFactor = 100000;
        } else {
            progressFactor = 10000000;
        }

        criteria["progress."+raid.name+".score"] = {$lt: (parseInt(filters.progress.kill)+1)*progressFactor};
    }

    if (filters.timezone && filters.timezone !="") {
        criteria["ad.timezone"] = filters.timezone;
    }

    if (filters.realmList && filters.realmList.length>0) {
        var realms = [];
        filters.realmList.forEach(function(realm){
            var tmpObj = {};
            tmpObj["$and"] = [{realm:realm.name,region:realm.region}];
            realms.push(tmpObj);

        });
        or.push(realms);
    }

    if (filters.wowProgress ==true) {
        criteria["id"] = 0;
    }

    if(or.length > 0 ) {
        criteria["$and"]=[];
        or.forEach(function(orVal){
            criteria["$and"].push({"$or":orVal});
        });
    }

    // Sort
    if (filters.sort && filters.sort == "ilevel") {
        sort = {"bnet.items.averageItemLevelEquipped": -1, "_id": -1};
        if (filters.last) {
            var orSort = [];
            var tmp = {};
            tmp["bnet.items.averageItemLevelEquipped"] = {$lt:filters.last.ilevel};
            orSort.push(tmp);
            tmp = {};
            tmp["bnet.items.averageItemLevelEquipped"] = filters.last.ilevel;
            tmp["_id"] = {$lt: new ObjectID(filters.last.id)};
            orSort.push(tmp);
            if (!criteria["$and"]) {
                criteria["$and"] = [];
            }
            criteria["$and"].push({"$or": orSort});
        }
    }

    if (filters.sort && filters.sort == "progress") {
        sort["progress."+raid.name+".score"] = -1;
        sort["_id"] =  -1;
        if (filters.last) {
            var orSort = [];
            var tmp = {};
            tmp["progress."+raid.name+".score"] = {$lt:filters.last.pveScore};
            orSort.push(tmp);
            tmp = {};
            tmp["progress."+raid.name+".score"] = filters.last.pveScore;
            tmp["_id"] = {$lt: new ObjectID(filters.last.id)};
            orSort.push(tmp);
            if (!criteria["$and"]) {
                criteria["$and"] = [];
            }
            criteria["$and"].push({"$or": orSort});
        }
    }

    if (filters.sort &&  filters.sort == "date") {
        sort = {"ad.updated": -1, "_id": -1};
        if (filters.last) {
            var orSort = [];
            var tmp = {};
            tmp["ad.updated"] = {$lt:filters.last.updated};
            orSort.push(tmp);
            tmp = {};
            tmp["ad.updated"] = filters.last.updated;
            tmp["_id"] = {$lt: new ObjectID(filters.last.id)};
            if (!criteria["$and"]) {
                criteria["$and"] = [];
            }
            criteria["$and"].push({"$or": orSort});
        }
    }

    // Projection
    var projection  = {};
    projection["name"] = 1;
    projection["realm"] = 1;
    projection["region"] = 1;
    projection["ad"] = 1;
    projection["bnet.level"] = 1;
    projection["bnet.class"] = 1;
    projection["bnet.items.averageItemLevelEquipped"] = 1;

    projection["bnet.items.finger1"] = 1;
    projection["bnet.items.finger2"] = 1;
    projection["bnet.faction"] = 1;
    projection["bnet.guild.name"] = 1;
    projection["bnet.progression.raids"] = 1;
    projection["warcraftLogs.logs"] = 1;
    projection["progress."+raid.name+".score"] = 1;

    database.find("characters", criteria, projection, number, sort, function(error,characters) {
        callback(error, characters);
    });
};

module.exports.getLastAds = function(callback) {
    var database = applicationStorage.getMongoDatabase();
    database.find("characters",{"ad.lfg":true} , {name:1,realm:1,region:1,"ad.updated":1,"bnet.class":1}, 5, {"ad.updated":-1},{"ad.lfg":1}, function(error,characters){
        callback(error, characters);
    });
};


module.exports.deleteAd = function(region,realm,name,id,callback) {
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("characters", {region:region,realm:realm,name:name,id:id} ,{$unset: {ad:"",id:""}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.deleteOldAds = function(timestamp,callback) {
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("characters", {"ad.updated":{$lte:timestamp},"ad.lfg":true} ,{$set: {"ad.lfg":false}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserAds = function(id,callback) {
    var database = applicationStorage.getMongoDatabase();
    database.find("characters", {id:id, "ad.lfg":{$exists:true}}, {name:1,realm:1,region:1,"ad.updated":1,"ad.lfg":1,"bnet.class":1}, 0, {"ad.updated":-1},{"ad.lfg":1}, function(error,ads){
        callback(error, ads);
    });
};

module.exports.getCount = function (callback) {
    var database = applicationStorage.getMongoDatabase();
    database.count('characters',null,function(error,count){
        callback(error,count);
    });
};


module.exports.getAdsCount = function (callback) {
    var database = applicationStorage.getMongoDatabase();
    database.count('characters',{"ad.lfg":true},function(error,count){
        callback(error,count);
    });
};

module.exports.search = function(search, callback) {
    if(!search || search.length <2){
        callback(new Error('Field search is required with 2 or more characters'));
        return;
    }

    var database = applicationStorage.getMongoDatabase();
    database.find("characters", {
        name:{$regex:"^"+search+".*",$options:"i"}
    }, {name:1,realm:1,region:1,"bnet.class":1}, 9,{},null, function(error,result){
        callback(error, result);
    });
};
