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

GuildAdModel.prototype.add = function(id,guildAd,callback) {
    guildAd.id=id;
    guildAd.updated=new Date().getTime();
    delete guildAd._id;
    this.database.InsertOrUpdate("guild-ads", {region:guildAd.region,realm:guildAd.realm,name:guildAd.name} ,guildAd, function(error,result){
        callback(error, result);
    });
};

GuildAdModel.prototype.get = function(guildAd,callback){
    this.database.get("guild-ads",{"region":guildAd.region,"realm":guildAd.realm,"name":guildAd.name},{},1,function(error,guildAd){
        callback(error, guildAd && guildAd[0]);
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