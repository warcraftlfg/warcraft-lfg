"use strict";

//Module dependencies
var async = require("async");
var characterAdSchema = process.require('config/db/characterAdSchema.json');
var applicationStorage = process.require("api/applicationStorage.js");
var characterService = process.require("services/characterService.js");
var Confine = require("confine");

//Configuration
var confine = new Confine();

module.exports.insertOrUpdateBnet = function(region,realm,name,bnet,callback) {
    var database = applicationStorage.getDatabase();


    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }

    var character ={}
    character.region = region;
    character.realm = realm;
    character.name = name;

    bnet.updated=new Date().getTime();

    character.bnet = bnet;

    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
        callback(error, result);
    });

};


module.exports.insertOrUpdateAd = function(region,realm,name,id,ad,callback) {
    var database = applicationStorage.getDatabase();

    //Normalize before insert
    ad = confine.normalize(ad,characterAdSchema);

    //Check for required attributes
    if(id == null){
        callback(new Error('Field id is required in CharacterModel'));
        return;
    }
    if(region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }


    characterService.isOwner(id,region,realm,name,function(error,isMyCharacter){
        if(error){
            callback(error);
            return;
        }
        if(isMyCharacter){
            var character ={}
            character.region = region;
            character.realm = realm;
            character.name = name;
            character.id = id;
            character.updated = new Date().getTime();

            ad.updated=new Date().getTime();

            character.ad = ad;

            database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,null ,character, function(error,result){
                callback(error, result);
            });
        }
        else
        {
            callback(new Error("CHARACTER_NOT_MEMBER_ERROR"));
        }
    });
};

module.exports.get = function(region,realm,name,callback){
    var database = applicationStorage.getDatabase();
    database.get("characters",{"region":region,"realm":realm,"name":name},{_id: 0},1,function(error,character){
        callback(error, character && character[0]);
    });
};

module.exports.getLastAds = function(number,callback){
    var number = number || 10;
    var database = applicationStorage.getDatabase();

    database.search("characters", {ad:{$exists:true}}, {_id: 0}, number, 1, {updated:-1}, function(error,characters){
        callback(error, characters);
    });
};

module.exports.getLast = function(number,callback){
    var number = number || 10;
    var database = applicationStorage.getDatabase();

    database.search("characters", {}, {_id: 0}, number, 1, {updated:-1}, function(error,characters){
        callback(error, characters);
    });
};

module.exports.deleteAd = function(region,realm,name,id,callback){
    var database = applicationStorage.getDatabase();
    var character = {}
    character.ad = null;
    database.insertOrUpdate("characters", {region:region,realm:realm,name:name} ,{$unset: {ad:""}} ,null, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserCharacterAds = function(id,callback){
    var database = applicationStorage.getDatabase();

    database.search("characters", {id:id, ad:{$exists:true}}, {_id: 0}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('characters',null,function(error,count){
        callback(error,count);
    });
};


module.exports.getAdsCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('characters',{ad:{$exists:true}},function(error,count){
        callback(error,count);
    });
};
