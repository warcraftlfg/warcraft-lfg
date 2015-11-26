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

module.exports.computeProgress = function(region,realm,name,raid,callback){
    var database = applicationStorage.getMongoDatabase();


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
    if(raid == null){
        callback(new Error('Field raid is required in GuildAdModel'));
        return;
    }

    var map = function(){
        var mapped = {
            timestamp : this.timestamp,
            boss: this.boss
        };
        var key = this.difficulty;
        emit(key, mapped);
    };

    var reduce = function(key,values){
        var reduced = {};
        values.forEach(function(value) {
            if(value.boss){
                if(reduced[value.boss] == null) {
                    reduced[value.boss] = {};
                    reduced[value.boss].timestamps = [];
                }

                reduced[value.boss].timestamps.push(value.timestamp);
            }
        });
        return reduced;
    };

    var finalize = function(key,value){
        return value;
    };

    database.mapReduce(raid,map, reduce, finalize,  { inline: 1 },
        {
            region:region,
            name:name,
            realm:realm,
            $or:[
                {$and:[{difficulty:"normal"},{roster:{$size:1}}]},
                {$and:[{difficulty:"heroic"},{roster:{$size:1}}]},
                {$and:[{difficulty:"mythic"},{roster:{$size:1}}]},
            ]
        },
        { bossWeight:1,timestamp:1}
        , function(err,result) {
            callback(err,result);
        });
};

module.exports.insertOrUpdateProgress = function(region,realm,name,progress,callback){
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

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

    progress.updated=new Date().getTime();

    guild.progress = progress;

    database.insertOrUpdate("guilds", {region:region,realm:realm,name:name} ,null ,guild, function(error,result){
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
    database.get("guilds",{"region":region,"realm":realm,"name":name},{_id:0},1,function(error,guild){
        callback(error, guild && guild[0]);
    });
};

module.exports.getAds = function (number,filters,callback) {
    var database = applicationStorage.getMongoDatabase();
    var criteria ={"ad.updated":{$exists:true}};
    var filters = filters || {};
    if(filters.last){
        criteria["ad.updated"]={$lt:filters.last}
    }
    if(filters.faction){
        criteria["bnet.side"] = parseInt(filters.faction);
    }
    if(filters.region && filters.region!=""){
        criteria["region"] = filters.region;
    }
    if(filters.language && filters.language!=""){
        criteria["ad.language"] = filters.language;
    }
    if(filters.raids_per_week && filters.raids_per_week.active){
        criteria["ad.raids_per_week.min"] = {$lte:filters.raids_per_week.min};
        criteria["ad.raids_per_week.max"] = {$gte:filters.raids_per_week.max};
    }

    if(filters.classes &&  filters.classes.length>0){
        //Horrible function for mapping role and classes ...
        var classes = [];
        var recruitment = [];

        filters.classes.forEach(function (classe){
            if(classe.role == "tank"){
                if(classe.id == 1)
                    recruitment.push({"ad.recruitment.tank.warrior":true});
                if(classe.id == 11)
                    recruitment.push({"ad.recruitment.tank.druid":true});
                if(classe.id == 2)
                    recruitment.push({"ad.recruitment.tank.paladin":true});
                if(classe.id == 10)
                    recruitment.push({"ad.recruitment.tank.monk":true});
            }
            if(classe.role == "heal"){
                if(classe.id == 11)
                    recruitment.push({"ad.recruitment.heal.druid":true});
                if(classe.id == 5)
                    recruitment.push({"ad.recruitment.heal.priest": true});
                if(classe.id == 2)
                    recruitment.push({"ad.recruitment.heal.paladin":true});
                if(classe.id == 7)
                    recruitment.push({"ad.recruitment.heal.shaman":true});
                if(classe.id == 10)
                    recruitment.push({"ad.recruitment.heal.monk":true});
            }
            if(classe.role == "melee_dps"){
                if(classe.id == 11)
                    recruitment.push({"ad.recruitment.melee_dps.druid":true});
                if(classe.id == 6)
                    recruitment.push({"ad.recruitment.melee_dps.deathknight":true});
                if(classe.id == 2)
                    recruitment.push({"ad.recruitment.melee_dps.paladin":true});
                if(classe.id == 10)
                    recruitment.push({"ad.recruitment.melee_dps.monk":true});
                if(classe.id == 7)
                    recruitment.push({"ad.recruitment.melee_dps.shaman":true});
                if(classe.id == 1)
                    recruitment.push({"ad.recruitment.melee_dps.warrior":true});
                if(classe.id == 4)
                    recruitment.push({"ad.recruitment.melee_dps.rogue":true});
            }
            if(classe.role == "ranged_dps"){
                if(classe.id == 5)
                    recruitment.push({"ad.recruitment.ranged_dps.priest":true});
                if(classe.id == 7)
                    recruitment.push({"ad.recruitment.ranged_dps.shaman":true});
                if(classe.id == 3)
                    recruitment.push({"ad.recruitment.ranged_dps.hunter":true});
                if(classe.id == 9)
                    recruitment.push({"ad.recruitment.ranged_dps.warlock":true});
                if(classe.id == 8)
                    recruitment.push({"ad.recruitment.ranged_dps.mage":true});
            }
        });
        if(recruitment.length>0)
            criteria["$or"] = recruitment;
    }
    database.find("guilds", criteria, {
        name:1,
        realm:1,
        region:1,
        "ad":1,
        "bnet.side":1,
        "wowProgress":1
    }, number, {"ad.updated":-1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.getLastAds = function (callback) {
    var database = applicationStorage.getMongoDatabase();
    database.find("guilds", {"ad.updated":{$exists:true}},{name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1}, 5, {"ad.updated":-1}, function(error,guilds){
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
    database.find("guilds", {id:id, "ad.updated":{$exists:true}}, {name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1}, 0,{updated:-1}, function(error,result){
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
    database.count('guilds',{"ad.updated":{$exists:true}},function(error,count){
        callback(error,count);
    });
};

module.exports.removeId = function(region,realm,name,id, callback) {
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("guilds", {region: region, realm: realm, name: name}, {$pull: {id: id}}, null, function (error) {
        callback(error);
    });
};

module.exports.search = function(search, callback) {
    if(!search || search.length <2){
        callback(new Error('Field search is required with 2 or more characters'));
        return;
    }

    var database = applicationStorage.getMongoDatabase();
    database.find("guilds", {
        name:{$regex:"^"+search+".*",$options:"i"}
    }, {name:1,realm:1,region:1,"bnet.side":1}, 3,{}, function(error,result){
        callback(error, result);
    });
};


