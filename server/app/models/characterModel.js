"use strict";

//Module dependencies
var async = require("async");
var characterAdSchema = process.require('config/db/characterAdSchema.json');
var applicationStorage = process.require("api/applicationStorage.js");
var Confine = require("confine");

//Configuration
var confine = new Confine();
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");


module.exports.insertOrUpdateWarcraftLogs = function(region,realm,name,warcraftLogs,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(name == null){
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
    if(region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(name == null){
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


module.exports.insertOrUpdateAd = function(region,realm,name,id,ad,callback) {

    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Normalize before insert
    ad = confine.normalize(ad,characterAdSchema);

    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in CharacterModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if(region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(name == null){
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
    if(id == null){
        callback(new Error('Field id is required in CharacterModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if(region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(name == null){
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
        _id: 0
    }, 1, function(error,character){
        callback(error, character && character[0]);
    });
};

module.exports.getAds = function(number, filters, callback){
    var number = number || 10;
    var database = applicationStorage.getMongoDatabase();
    var criteria ={"ad.updated":{$exists:true}};
    var filters = filters || {};

    var or = [];
    if(filters.last){
        criteria["ad.updated"]={$lt:filters.last}
    }
    if(filters.lvlmax){
        criteria["bnet.level"] = {$gte:100};
    }
    if(filters.faction){
        criteria["bnet.faction"] = parseInt(filters.faction);
    }
    if(filters.transfert){
        criteria["ad.transfert"] = filters.transfert;
    }
    if(filters.region && filters.region!=""){
        criteria["region"] = filters.region;
    }
    if(filters.languages && filters.languages.length>0){
        var languages = [];
        filters.languages.forEach(function(item){
            languages.push(item.id);
        });
        criteria["ad.languages"] = { $in: languages};
    }
    if(filters.classes && filters.classes.length>0 && filters.classes.length < 11){
        var classes = [];
        filters.classes.forEach(function(item){
            classes.push(item.id);
        });
        criteria["bnet.class"] = { $in: classes};
    }
    if(filters.roles && filters.roles.length > 0){
        var roles = []
        filters.roles.forEach(function(role){
            var tmpObj = {};
            tmpObj["ad.role."+role.id] = true;
            roles.push(tmpObj);
        });
        or.push(roles);


    }
    if(filters.days && filters.days.length>0){
        var days = [];
        filters.days.forEach(function(day){
            var tmpObj = {};
            tmpObj["ad.play_time."+day.id+".play"] = true;
            days.push(tmpObj);

        });
        or.push(days);

    }

    if(filters.raids_per_week && filters.raids_per_week.active){
        criteria["ad.raids_per_week.min"] = {$lte:filters.raids_per_week.min};
        criteria["ad.raids_per_week.max"] = {$gte:filters.raids_per_week.max};
    }
    if(filters.timezone && filters.timezone !=""){
        criteria["ad.timezone"] = filters.timezone;
    }

    if (filters.realm && filters.realm.connected_realms && filters.realm.region){
        var realms = [];
        filters.realm.connected_realms.forEach(function(realm){
            var tmpObj = {};
            tmpObj["realm"] = realm.name;
            realms.push(tmpObj);

        });
        or.push(realms);
        criteria["region"] = filters.realm.region;

    }
    if(or.length > 0 ){
        criteria["$and"]=[];
        or.forEach(function(orVal){
            criteria["$and"].push({"$or":orVal});
        });
    }
    console.log(criteria);
    database.find("characters",criteria , {
        name:1,
        realm:1,
        region:1,
        "ad":1,
        "bnet.level":1,
        "bnet.class":1,
        "bnet.items.averageItemLevelEquipped":1,
        "bnet.items.finger1":1,
        "bnet.items.finger2":1,
        "bnet.faction":1,
        "bnet.guild.name":1,
        "bnet.progression.raids":{$slice:-1},
        "warcraftLogs.logs":1

    }, number, {"ad.updated":-1}, function(error,characters){
        callback(error, characters);
    });
};

module.exports.getLastAds = function(callback){
    var database = applicationStorage.getMongoDatabase();
    database.find("characters",{"ad.updated":{$exists:true}} , {name:1,realm:1,region:1,"ad.updated":1,"bnet.class":1}, 5, {"ad.updated":-1}, function(error,characters){
        callback(error, characters);
    });
};


module.exports.deleteAd = function(region,realm,name,id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("characters", {region:region,realm:realm,name:name,id:id} ,{$unset: {ad:""}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.deleteOldAds = function(timestamp,callback){
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("characters", {"ad.updated":{$lte:timestamp}} ,{$unset: {ad:""}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserAds = function(id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.find("characters", {id:id, "ad.updated":{$exists:true}}, {name:1,realm:1,region:1,"ad.updated":1,"bnet.class":1}, 0, {updated:-1}, function(error,ads){
        callback(error, ads);
    });
};

module.exports.getCount = function (callback){
    var database = applicationStorage.getMongoDatabase();
    database.count('characters',null,function(error,count){
        callback(error,count);
    });
};


module.exports.getAdsCount = function (callback){
    var database = applicationStorage.getMongoDatabase();
    database.count('characters',{"ad.updated":{$exists:true}},function(error,count){
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
    }, {name:1,realm:1,region:1,"bnet.class":1}, 9,{}, function(error,result){
        callback(error, result);
    });
};
