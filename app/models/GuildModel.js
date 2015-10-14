"use strict"

//Module dependencies
var applicationStorage = process.require("app/api/applicationStorage");

/**
 * Defines a model class to manipulate characters
 * @constructor
 */
function GuildModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = GuildModel;

GuildModel.prototype.add = function(region,guild,callback) {
    guild.region = region;
    this.database.InsertOrUpdate("guilds", {region:guild.region,realm:guild.realm,name:guild.name} ,guild, function(error,result){
        callback(error, result);
    });
};



