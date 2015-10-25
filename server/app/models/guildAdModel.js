"use strict"

//Defines dependencies
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var userService = process.require("services/userService.js");
var Confine = require("confine");
var async = require("async");

//Configuration
var confine = new Confine();


module.exports.insertOrUpdate = function(id,guildAd,callback) {
    var database = applicationStorage.getDatabase();

    guildAd = confine.normalize(guildAd,guildAdSchema);

    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in GuildAdModel'));
        return;
    }
    if(guildAd.region == null){
        callback(new Error('Field region is required in GuildAdModel'));
        return;
    }
    if(guildAd.realm == null){
        callback(new Error('Field realm is required in GuildAdModel'));
        return;
    }
    if(guildAd.name == null){
        callback(new Error('Field name is required in GuildAdModel'));
        return;
    }

    userService.getGuilds(guildAd.region, id, function(error,guilds){
        if (error){
            callback(error);
            return;
        }
        var isMyGuild = false;
        async.forEach(guilds, function (guild, callback) {
            if (guild.name == guildAd.name && guild.realm == guildAd.realm)
                isMyGuild = true;
            callback();
        });
        if(isMyGuild){
            guildAd.updated=new Date().getTime();
            delete guildAd.id;
            database.insertOrUpdate("guild-ads", {region:guildAd.region,realm:guildAd.realm,name:guildAd.name}, {$set:guildAd,$addToSet:{id:id}}, null, function(error){
                callback(error, guildAd);
            });
        }
        else {
            //Remove user from guild (gquit / gkick)
            database.insertOrUpdate("guild-ads", {region:guildAd.region,realm:guildAd.realm,name:guildAd.name}, {$pull:{id:id}}, null, function(error){
                if (error)
                    logger.error(error.message);
                callback(new Error("GUILD_NOT_MEMBER_ERROR"));
            });
        }
    });
};

module.exports.getLast = function (number,callback) {
    var number = number || 10;
    var database = applicationStorage.getDatabase();
    database.search("guild-ads", {}, {_id: 0}, number, 1, {updated:-1}, function(error,guildAds){
        callback(error, guildAds);
    });
};


module.exports.delete = function(id,guildAd,callback){
    var database = applicationStorage.getDatabase();
    database.remove("guild-ads",{"region":guildAd.region,"realm":guildAd.realm,"name":guildAd.name,"id":id},function(error,guildAd){
        callback(error, guildAd);
    });
};

module.exports.getUserGuildAds = function(id,callback){
    var database = applicationStorage.getDatabase();
    database.search("guild-ads", {id:id}, {_id: 0}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

module.exports.get = function(guildAd,callback){
    var database = applicationStorage.getDatabase();
    database.get("guild-ads",{"region":guildAd.region,"realm":guildAd.realm,"name":guildAd.name},{_id: 0},1,function(error,guildAd){
        callback(error, guildAd && guildAd[0]);
    });
};

module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('guild-ads',function(error,count){
        callback(error,count);
    });
};


