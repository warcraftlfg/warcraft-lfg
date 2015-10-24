"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("api/applicationStorage.js");
var UserModel = process.require("models/UserModel.js");

//Configuration
var userModel = new UserModel();

/**
 * Defines a model class to manipulate characters
 * @constructor
 */
function GuildAdModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = GuildAdModel;

GuildAdModel.prototype.add = function(id,guildAd,callback) {
    var self=this;
    userModel.getGuilds(guildAd.region,id, function (error,guilds) {
        if (error) {
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
            delete guildAd._id;
            self.database.insertOrUpdate("guild-ads", {region:guildAd.region,realm:guildAd.realm,name:guildAd.name} ,guildAd, function(error,result){
                if (error) {
                    callback(error);
                    return;
                }
                self.database.update("guild-ads", {region:guildAd.region,realm:guildAd.realm,name:guildAd.name} ,{$addToSet:{id:id}},guildAd, function(error,result){
                    callback(error, result);
                });
            });
        }
        else
        {
            callback(new Error("GUILD_NOT_MEMBER_ERROR"));
        }
    });
};

GuildAdModel.prototype.get = function(guildAd,callback){
    this.database.get("guild-ads",{"region":guildAd.region,"realm":guildAd.realm,"name":guildAd.name},{},1,function(error,guildAd){
        callback(error, guildAd && guildAd[0]);
    });
};

GuildAdModel.prototype.delete = function(id,guildAd,callback){
    this.database.remove("guild-ads",{"region":guildAd.region,"realm":guildAd.realm,"name":guildAd.name,"id":id},function(error,guildAd){
        callback(error, guildAd);
    });
};

GuildAdModel.prototype.getLast = function(callback){
    this.database.search("guild-ads", {}, {}, 5, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

GuildAdModel.prototype.getUserGuildAds = function(id,callback){
    this.database.search("guild-ads", {id:id}, {}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};