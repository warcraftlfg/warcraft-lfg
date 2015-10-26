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


module.exports.get = function(character,callback){
    var database = applicationStorage.getDatabase();
    database.get("characters",{"region":character.region,"realm":character.realm,"name":character.name},{_id: 0},1,function(error,character){
        callback(error, character && character[0]);
    });
};

module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('characters',function(error,count){
        callback(error,count);
    });
};

module.exports.getLast = function(number,callback){
    var number = number || 10;
    var database = applicationStorage.getDatabase();

    database.search("characters", {}, {_id: 0,region:1,realm:1,name:1}, number, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

