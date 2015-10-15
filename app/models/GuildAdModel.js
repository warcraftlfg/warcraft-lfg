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
    this.database.InsertOrUpdate("guild-ads", {region:guild_ad.region,realm:guild_ad.realm,name:guild_ad.name} ,guild_ad, function(error,result){
        callback(error, result);
    });
};

GuildAdModel.prototype.getLast = function(callback){
    this.database.search("guild-ads", {}, {}, 5, 1, {_id:1}, function(error,result){
        callback(error, result);
    });

}