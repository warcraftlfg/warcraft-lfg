"use strict"

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");


module.exports.insertOrUpdate = function (guild,callback) {
    var database = applicationStorage.getDatabase();
    //Check for required attributes
    if(guild.region == null){
        callback(new Error('Field region is required in GuildModel'));
        return;
    }
    if(guild.realm == null){
        callback(new Error('Field realm is required in GuildModel'));
        return;
    }
    if(guild.name == null){
        callback(new Error('Field name is required in GuildModel'));
        return;
    }

    //Create or update guild
    guild.updated=new Date().getTime();
    database.insertOrUpdate("guilds",{region:guild.region,realm:guild.realm,name:guild.name}, null, guild, function(error,result){
        callback(error, result);
    });
};


module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('guilds',function(error,count){
        callback(error,count);
    });
};
