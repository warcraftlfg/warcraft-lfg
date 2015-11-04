"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var async = require('async');

module.exports.insertOrUpdate = function (region,realm,name,priority,callback) {
    var database = applicationStorage.getRedisDatabase();


    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in CharacterUpdateModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterUpdateModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in CharacterUpdateModel'));
        return;
    }
    if(priority == null){
        callback(new Error('Field priority is required in CharacterUpdateModel'));
        return;
    }


    //Force region to lower case
    region = region.toLowerCase();

    database.setUpdate('cu',priority,region+'_'+realm+'_'+name,{region:region,realm:realm,name:name,priority:priority},function(error,result){
        callback(error);
    });
};


module.exports.getNextToUpdate = function (callback){
    var database = applicationStorage.getRedisDatabase();

    async.each(config.priorities,function(priority,callback){
        database.getUpdate('cu', priority, function (error, result) {
            if(error){
                return callback({error:error});
            }
            if(result)
                callback({result:result});
            else
                callback()

        });
    },function(result){
        if(!result)
            return callback();
        if(result.error)
            return callback(result.error)
        callback(null,result.result);
    });

};

module.exports.getPosition = function (priority,callback){
    var database = applicationStorage.getRedisDatabase();
    database.getUpdateCount('cu',priority,function(error,count){
        callback(error,count);
    });
};
