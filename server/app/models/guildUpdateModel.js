"use strict";

//Defines dependencies
var guildUpdateSchema = process.require('config/db/guildUpdateSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();

module.exports.insertOrUpdate = function (guildUpdate,callback) {
    var database = applicationStorage.getDatabase();

    guildUpdate = confine.normalize(guildUpdate,guildUpdateSchema);

    //Check for required attributes
    if(guildUpdate.region == null){
        callback(new Error('Field region is required in GuildUpdateModel'));
        return;
    }
    if(guildUpdate.realm == null){
        callback(new Error('Field realm is required in GuildUpdateModel'));
        return;
    }
    if(guildUpdate.name == null){
        callback(new Error('Field name is required in GuildUpdateModel'));
        return;
    }

    //Create or update guildUpdate
    database.insertOrUpdate("guild-updates",{region:guildUpdate.region,realm:guildUpdate.realm,name:guildUpdate.name}, null, guildUpdate, function(error){
        callback(error, guildUpdate);
    });
};

module.exports.delete = function (guildUpdate,callback) {
    var database = applicationStorage.getDatabase();
    database.remove("guild-updates",guildUpdate,function(error){
        callback(error);
    });
}

module.exports.getOldest = function (callback){
    var database = applicationStorage.getDatabase();
    database.search("guild-updates", {}, {_id: 0}, 1, 1, {_id:1}, function(error,data){
        if(error) {
            callback(error);
            return;
        }
        if(data.length == 0 ) {
            callback (null,null);
            return;
        }
        callback(null, data[0]);
    });
};



