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
            timestamp:this.timestamp,
            roster:this.roster.length
        };
        var key = {difficulty:this.difficulty,boss:this.boss};
        emit(key, mapped);
    };

    var reduce = function(key,values){
        var reduced = {timestamps:[]};

        for(var idx=0;idx<values.length;idx++){

            if(idx<values.length-1 && values[idx].timestamp+2000 >= values[idx+1].timestamp) {
                var rosterLength = values[idx].roster + values[idx+1].roster;
                if((key.difficulty == "mythic" && rosterLength>=16) ||
                    ((key.difficulty == "normal" || key.difficulty =="heroic")&& values[idx].roster >=8))
                    reduced.timestamps.push([values[idx].timestamp, values[idx + 1].timestamp]);
                idx++;
            }
            else{
                if((key.difficulty == "mythic" && values[idx].roster >=16 ) ||
                    ((key.difficulty == "normal" || key.difficulty =="heroic")&& values[idx].roster >=8 ))
                    reduced.timestamps.push([values[idx].timestamp]);
            }
        }

        return reduced;
    };

    var finalize = function(key,value){
        if(value.timestamp){
            if((key.difficulty == "mythic" && value.roster >=16 ) ||
                ((key.difficulty == "normal" || key.difficulty =="heroic")&& value.roster >=8 ))
                return [value];
            else
                return null;
        }
        return value;
    };

    database.mapReduce(raid, map, reduce, finalize, { inline: 1},
        {
            region:region,
            realm:realm,
            name:name
        },
        {bossWeight:1,timestamp:1}
        , function(err,result) {
            callback(err,result);
        });
};

module.exports.insertOrUpdateProgress = function(region,realm,name,raid, progress,callback){
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

    guild.progress = {};
    guild.progress[raid] = progress;

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
        var result = undefined;
        if(guild && guild[0]){
            result =  guild[0];
            result.ad = confine.normalize(result.ad,guildAdSchema);
        }
        callback(error, result);
    });
};

module.exports.getAds = function (number,filters,callback) {
    var database = applicationStorage.getMongoDatabase();
    var criteria ={"ad.updated":{$exists:true},"ad.lfg":true};
    var filters = filters || {};
    var or = [];
    if(filters.last){
        criteria["ad.updated"]={$lt:filters.last}
    }
    if(filters.faction){
        criteria["bnet.side"] = parseInt(filters.faction,10);
    }
    if(filters.languages && filters.languages.length>0){
        var languages = [];
        filters.languages.forEach(function(item){
            languages.push(item.id);
        });
        criteria["ad.language"] = { $in: languages};
    }
    if(filters.raids_per_week && filters.raids_per_week.active){
        criteria["ad.raids_per_week.min"] = {$gte:parseInt(filters.raids_per_week.min,10)};
        criteria["ad.raids_per_week.max"] = {$lte:parseInt(filters.raids_per_week.max,10)};
    }

    if(filters.classes &&  filters.classes.length>0){
        //Horrible function for mapping role and classes ...
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
                if(classe.id == 6)
                    recruitment.push({"ad.recruitment.tank.deathknight":true});
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
                if(classe.id == 11)
                    recruitment.push({"ad.recruitment.ranged_dps.druid":true});
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
            or.push(recruitment);
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

    if(filters.timezone && filters.timezone !=""){
        criteria["ad.timezone"] = filters.timezone;
    }

    if (filters.realmList &&  filters.realmList.length>0){
        var realms = [];
        filters.realmList.forEach(function(realm){
            var tmpObj = {};
            tmpObj["$and"] = [{realm:realm.name,region:realm.region}];
            realms.push(tmpObj);

        });
        or.push(realms);

    }
    if (filters.wowProgress ==true){
        criteria["id"] = {"$eq":0};
    }
    if(or.length > 0 ){
        criteria["$and"]=[];
        or.forEach(function(orVal){
            criteria["$and"].push({"$or":orVal});
        });
    }


    var projection  = {};
    projection["name"] = 1;
    projection["realm"] = 1;
    projection["region"] = 1;
    projection["ad"] = 1;
    projection["wowProgress"] = 1;
    projection["bnet.side"] = 1;
    projection["wowProgress"] = 1;

    config.progress.raids.forEach(function(raid){
        projection["progress."+raid.name+".normalCount"] = 1;
        projection["progress."+raid.name+".heroicCount"] = 1;
        projection["progress."+raid.name+".mythicCount"] = 1;
    });

    database.find("guilds", criteria,projection, number, {"ad.updated":-1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.getLastAds = function (callback) {
    var database = applicationStorage.getMongoDatabase();
    database.find("guilds", {"ad.updated":{$exists:true},"ad.lfg":true},{name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1}, 5, {"ad.updated":-1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.deleteAd = function(region,realm,name,id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("guilds", {region:region,realm:realm,name:name,id:id} ,{$unset: {ad:""},$pull:{id:0}}  ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.deleteOldAds = function(timestamp,callback){
    var database = applicationStorage.getMongoDatabase();
    database.insertOrUpdate("guilds", {"ad.updated":{$lte:timestamp},"ad.lfg":true} ,{$set: {"ad.lfg":false}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserAds = function(id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.find("guilds", {id:id, "ad.updated":{$exists:true}}, {name:1,realm:1,region:1,"ad.updated":1,"ad.lfg":1,"bnet.side":1}, 0,{"ad.updated":-1}, function(error,result){
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
    database.count('guilds',{"ad.updated":{$exists:true},"ad.lfg":true},function(error,count){
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


