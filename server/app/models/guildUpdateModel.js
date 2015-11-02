"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");

module.exports.insertOrUpdate = function (region,realm,name,priority,callback) {
    var database = applicationStorage.getDatabase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildUpdateModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in GuildUpdateModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildUpdateModel'));
        return;
    }
    if(priority == null){
        callback(new Error('Field priority is required in GuildUpdateModel'));
        return;
    }


    //Force region to lower case
    region = region.toLowerCase();

    //Create or update guildUpdate
    database.insertOrUpdate("guild-updates",{region:region,realm:realm,name:name}, null, {region:region,realm:realm,name:name,priority:priority}, function(error){
        callback(error);
    });
};

module.exports.delete = function (region,realm,name,callback) {
    var database = applicationStorage.getDatabase();
    database.remove("guild-updates",{region:region,realm:realm,name:name},function(error){
        callback(error);
    });
}


module.exports.getNextToUpdate = function (callback){
    var database = applicationStorage.getDatabase();
    database.findAndModify("guild-updates", {},{priority:-1,_id:1},null,{remove:true}, function(error,characterUpdate){
        if(error) {
            callback(error);
            return;
        }
        callback(null, characterUpdate.value);
    });
};

module.exports.getPosition = function (priority,callback){
    var database = applicationStorage.getDatabase();
    database.count('guild-updates',{priority:{$gte:priority}},function(error,count){
        callback(error,count);
    });
};



