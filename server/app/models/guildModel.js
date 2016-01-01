"use strict"

//Defines dependencies
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var guildPermsSchema = process.require('config/db/guildPermsSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");
var async = require("async");
var ObjectID = require('mongodb').ObjectID;

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

    wowProgress.updated = new Date().getTime();

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
    if (region == null) {
        callback(new Error('Field region is required in GuildModel'));
        return;
    }
    if (config.bnet_regions.indexOf(region) == -1) {
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in GuildModel'));
        return;
    }
    if (name == null) {
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

module.exports.insertOrUpdatePerms = function(region,realm,name,id,perms,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Force region tolowercase
    region = region.toLowerCase();

    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in GuildPermsModel'));
        return;
    }
    if(config.bnet_regions.indexOf(region)==-1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if(region == null){
        callback(new Error('Field region is required in GuildPermsModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in GuildPermsModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildPermsModel'));
        return;
    }

    var guild = {
        perms: confine.normalize(perms,guildPermsSchema)
    };

    database.insertOrUpdate("guilds", {region: region, realm: realm, name: name}, {$set: guild}, null, function (error,result) {
        callback(error, result);
    });
};

module.exports.computeProgress = function(region,realm,name,raid,callback){
    var database = applicationStorage.getMongoDatabase();


    if (config.bnet_regions.indexOf(region) == -1){
        callback(new Error('Region '+ region +' is not allowed'));
        return;
    }
    if (region == null) {
        callback(new Error('Field region is required in GuildAdModel'));
        return;
    }
    if (realm == null) {
        callback(new Error('Field realm is required in GuildAdModel'));
        return;
    }
    if (name == null) {
        callback(new Error('Field name is required in GuildAdModel'));
        return;
    }
    if (raid == null) {
        callback(new Error('Field raid is required in GuildAdModel'));
        return;
    }

    var map = function(){
        var mapped = {
            timestamp:this.timestamp,
            roster:this.roster,
            source:this.source
        };
        var key = {difficulty:this.difficulty,boss:this.boss};
        emit(key, mapped);
    };

    var reduce = function(key, values){
        var reduced = {timestamps:[]};

        if (values && values[0] && values[0].timestamps) {
            reduced = values[0];
        }

        for (var idx = 0; idx < values.length; idx++) {
            if (values[idx].source == "wowprogress") {
                if (idx < values.length && values[idx].timestamp + 1000 <= values[idx + 1].timestamp && values[idx + 1].source == "progress"){
                    //Add only if no progress are found in + or - 1 sec of wowprogress entri
                    reduced.timestamps.push([values[idx].timestamp]);
                }
                else{
                    reduced.timestamps.push([values[idx].timestamp]);
                }
            }
            else if (values[idx].source == "progress") {
                if (idx < values.length - 1 && values[idx].timestamp + 1000 >= values[idx + 1].timestamp) {
                    var rosterLength = values[idx].roster.length + values[idx + 1].roster.length;
                    if ((key.difficulty == "mythic" && rosterLength >= 16) || ((key.difficulty == "normal" || key.difficulty == "heroic") && rosterLength >= 8)) {
                        reduced.timestamps.push([values[idx].timestamp, values[idx + 1].timestamp]);
                    }
                    idx++;
                }
                else {
                    if (values[idx].roster && ((key.difficulty == "mythic" && values[idx].roster.length >= 16) || ((key.difficulty == "normal" || key.difficulty == "heroic") && values[idx].roster.length >= 8 ))) {
                        reduced.timestamps.push([values[idx].timestamp]);
                    }
                }
            }
        }


        return reduced;
    };

    var finalize = function(key, value){
        if (value.timestamp) {
            if ((key.difficulty == "mythic" && value.roster.length >=16 ) || ((key.difficulty == "normal" || key.difficulty =="heroic") && value.roster.length >=8) || value.source == "wowprogress") { 
                return {timestamps:[[value.timestamp]]};
            }
            else {
                return {timestamps:[]};
            }
        }
        return value;
    };

    database.mapReduce(raid, map, reduce, finalize, { inline: 1},
        {
            region:region,
            realm:realm,
            name:name
        },
        {bossWeight:1, timestamp:1, source:-1}
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

    progress.updated = new Date().getTime();

    guild.progress = {};
    guild.progress[raid] = progress;

    database.insertOrUpdate("guilds", {region:region, realm:realm, name:name}, null, guild, function(error, result){
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
            result.perms = confine.normalize(result.perms,guildPermsSchema);
        }
        callback(error, result);
    });
};

module.exports.getAds = function (number,filters,callback) {
    var number = number || 10;
    var database = applicationStorage.getMongoDatabase();
    var criteria ={"ad.lfg":true};
    var filters = filters || {};
    var sort = {};
    var raid = config.progress.raids[0];

    // Filter
    var or = [];
    if (filters.faction) {
        criteria["bnet.side"] = parseInt(filters.faction, 10);
    }

    if (filters.languages && filters.languages.length > 0) {
        var languages = [];
        filters.languages.forEach(function(item) {
            languages.push(item.id);
        });
        criteria["ad.language"] = {$in: languages};
    }

    if (filters.raids_per_week && filters.raids_per_week.active) {
        criteria["ad.raids_per_week.min"] = {$gte:parseInt(filters.raids_per_week.min,10)};
        criteria["ad.raids_per_week.max"] = {$lte:parseInt(filters.raids_per_week.max,10)};
    }

    if (filters.classes &&  filters.classes.length > 0) {
        //Horrible function for mapping role and classes ...
        var recruitment = [];

        filters.classes.forEach(function (classe){
            if (classe.role == "tank") {
                if (classe.id == 1) {
                    recruitment.push({"ad.recruitment.tank.warrior":true});
                }
                if (classe.id == 11) {
                    recruitment.push({"ad.recruitment.tank.druid":true});
                }
                if (classe.id == 2) {
                    recruitment.push({"ad.recruitment.tank.paladin":true});
                }
                if (classe.id == 10) {
                    recruitment.push({"ad.recruitment.tank.monk":true});
                }
                if (classe.id == 6) {
                    recruitment.push({"ad.recruitment.tank.deathknight":true});
                }
            }
            if (classe.role == "heal") {
                if (classe.id == 11) {
                    recruitment.push({"ad.recruitment.heal.druid":true});
                }
                if (classe.id == 5) {
                    recruitment.push({"ad.recruitment.heal.priest": true});
                }
                if (classe.id == 2) {
                    recruitment.push({"ad.recruitment.heal.paladin":true});
                }
                if (classe.id == 7) {
                    recruitment.push({"ad.recruitment.heal.shaman":true});
                }
                if (classe.id == 10) {
                    recruitment.push({"ad.recruitment.heal.monk":true});
                }
            }
            if (classe.role == "melee_dps") {
                if (classe.id == 11) {
                    recruitment.push({"ad.recruitment.melee_dps.druid":true});
                }
                if (classe.id == 6) {
                    recruitment.push({"ad.recruitment.melee_dps.deathknight":true});
                }
                if (classe.id == 2) {
                    recruitment.push({"ad.recruitment.melee_dps.paladin":true});
                }
                if (classe.id == 10) {
                    recruitment.push({"ad.recruitment.melee_dps.monk":true});
                }
                if (classe.id == 7) {
                    recruitment.push({"ad.recruitment.melee_dps.shaman":true});
                }
                if (classe.id == 1) {
                    recruitment.push({"ad.recruitment.melee_dps.warrior":true});
                }
                if (classe.id == 4) {
                    recruitment.push({"ad.recruitment.melee_dps.rogue":true});
                }
            }
            if (classe.role == "ranged_dps") {
                if (classe.id == 11) {
                    recruitment.push({"ad.recruitment.ranged_dps.druid":true});
                }
                if (classe.id == 5) {
                    recruitment.push({"ad.recruitment.ranged_dps.priest":true});
                }
                if (classe.id == 7) {
                    recruitment.push({"ad.recruitment.ranged_dps.shaman":true});
                }
                if (classe.id == 3) {
                    recruitment.push({"ad.recruitment.ranged_dps.hunter":true});
                }
                if (classe.id == 9) {
                    recruitment.push({"ad.recruitment.ranged_dps.warlock":true});
                }
                if (classe.id == 8) {
                    recruitment.push({"ad.recruitment.ranged_dps.mage":true});
                }
            }
        });
        if(recruitment.length > 0) {
            or.push(recruitment);
        }
    }

    if (filters.days && filters.days.length > 0){
        var days = [];
        filters.days.forEach(function(day){
            var tmpObj = {};
            tmpObj["ad.play_time."+day.id+".play"] = true;
            days.push(tmpObj);

        });
        or.push(days);
    }

    if (filters.timezone && filters.timezone != "") {
        criteria["ad.timezone"] = filters.timezone;
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

    if (filters.realmList && filters.realmList.length > 0) {
        var realms = [];
        filters.realmList.forEach(function(realm){
            var tmpObj = {};
            tmpObj["$and"] = [{realm:realm.name,region:realm.region}];
            realms.push(tmpObj);

        });
        or.push(realms);
    }

    if (filters.wowProgress == true) {
        criteria["id"] = {"$eq":0};
    }

    if (or.length > 0 ) {
        criteria["$and"]=[];
        or.forEach(function(orVal){
            criteria["$and"].push({"$or":orVal});
        });
    }

    // Sort
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

    if (filters.sort && filters.sort == "ranking") {
        criteria["wowProgress"] = {$exists:true};
        sort = {"wowProgress.world_rank": 1, "_id": -1};
        if (filters.last) {
            var orSort = [];
            var tmp = {};
            tmp["wowProgress.world_rank"] = {$gt:filters.last.ranking};
            orSort.push(tmp);
            tmp = {};
            tmp["wowProgress.world_rank"] = filters.last.ranking;
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


    var projection  = {};
    projection["name"] = 1;
    projection["realm"] = 1;
    projection["region"] = 1;
    projection["ad"] = 1;
    projection["wowProgress"] = 1;
    projection["bnet.side"] = 1;
    projection["wowProgress"] = 1;

    config.progress.raids.forEach(function(raid) {
        projection["progress."+raid.name+".score"] = 1;
        projection["progress."+raid.name+".normalCount"] = 1;
        projection["progress."+raid.name+".heroicCount"] = 1;
        projection["progress."+raid.name+".mythicCount"] = 1;
    });

    database.find("guilds", criteria, projection, number, sort, {"ad.lfg":1}, function(error,guilds){
        callback(error, guilds);
    });
};

module.exports.getLastAds = function (callback) {
    var database = applicationStorage.getMongoDatabase();
    database.find("guilds", {"ad.lfg":true},{name:1,realm:1,region:1,"ad.updated":1,"bnet.side":1}, 5, {"ad.updated":-1},"ad.lfg_1", function(error,guilds){
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
    database.find("guilds", {id:id, "ad.lfg":{$exists:true}}, {name:1,realm:1,region:1,"ad.updated":1,"ad.lfg":1,"bnet.side":1,"perms":1}, -1,{"ad.updated":-1},{"ad.lfg":1},function(error,result){
        if (error) {
            callback(error, null);
            return;
        }
        result.forEach(function(guild) {
            guild.perms = confine.normalize(guild.perms,guildPermsSchema);
        });
        callback(null, result);
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
    database.count('guilds',{"ad.lfg":true},function(error,count){
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
    }, {name:1,realm:1,region:1,"bnet.side":1}, 3,{},null, function(error,result){
        callback(error, result);
    });
};


