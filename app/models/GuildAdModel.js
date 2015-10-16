"use strict"

//Module dependencies
var applicationStorage = process.require("app/api/applicationStorage");

/**
 * Defines a model class to manipulate characters
 * @constructor
 */
function GuildAdModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = GuildAdModel;

GuildAdModel.prototype.add = function(id,guild_ad,callback) {
    guild_ad.id=id;
    guild_ad.updated=new Date().getTime();
    delete guild_ad._id;
    this.database.InsertOrUpdate("guild-ads", {region:guild_ad.region,realm:guild_ad.realm,name:guild_ad.name} ,guild_ad, function(error,result){
        callback(error, result);
    });
};

GuildAdModel.prototype.get = function(guild_ad,callback){
    this.database.get("guild-ads",{"region":guild_ad.region,"realm":guild_ad.realm,"name":guild_ad.name},{},1,function(error,guild_ad){
        callback(error, guild_ad && guild_ad[0]);
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
}