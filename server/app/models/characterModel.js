"use strict"

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");

module.exports.insertOrUpdate = function (character,callback) {
    var database = applicationStorage.getDatabase();

    //Check for required attributes
    if(character.region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(character.realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(character.name == null){
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }

    //Create or update guild
    character.updated=new Date().getTime();
    database.insertOrUpdate("characters",{region:character.region,realm:character.realm,name:character.name},null,character, function(error,result){
        callback(error, result);
    });
};

module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('characters',function(error,count){
        callback(error,count);
    });
};


