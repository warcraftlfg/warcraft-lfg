"use strict";

//Module dependencies
var async = require("async");
var characterAdSchema = process.require('config/db/characterAdSchema.json');
var applicationStorage = process.require("api/applicationStorage.js");
var userService = process.require("services/userService.js");
var Confine = require("confine");

//Configuration
var confine = new Confine();


module.exports.insertOrUpdate = function(id,characterAd,callback) {
    var database = applicationStorage.getDatabase();

    characterAd =  confine.normalize(characterAd,characterAdSchema);

    userService.getCharacters(characterAd.region,id, function (error,characters) {
        if (error) {
            callback(error);
            return;
        }
        var isMyCharacter = false;
        async.forEach(characters, function (character, callback) {
            if (character.name == characterAd.name && character.realm == characterAd.realm)
                isMyCharacter = true;
            callback();
        });

        if(isMyCharacter){
            characterAd.id=id;
            characterAd.updated=new Date().getTime();
            delete characterAd._id;
            database.insertOrUpdate("character-ads", {region:characterAd.region,realm:characterAd.realm,name:characterAd.name} ,null ,characterAd, function(error,result){
                callback(error, result);
            });
        }
        else
        {
            callback(new Error("CHARACTER_NOT_MEMBER_ERROR"));
        }
    });
};

module.exports.get = function(characterAd,callback){
    var database = applicationStorage.getDatabase();

    database.get("character-ads",{"region":characterAd.region,"realm":characterAd.realm,"name":characterAd.name},{_id: 0},1,function(error,characterAd){
        if (error) {
            callback(error);
            return;
        }
        characterAd = characterAd[0];
        if (characterAd){
            database.get("users",{id: characterAd.id},{_id: 0, accessToken: 0},1,function(error,user) {
                characterAd.user = user[0];

                //TODO Faire un mapReduce pour sélectionner Agréger les infos plutot que de tout renvoyer ...
                database.get("characters",{"region":characterAd.region,"realm":characterAd.realm,"name":characterAd.name},{},1,function(error,character) {
                    if (error) {
                        callback(error);
                        return;
                    }
                    characterAd.character = character;
                    callback(error, characterAd);
                });
            });
        }
        else{
            callback(error, characterAd);
        }
    });
};

module.exports.getLast = function(callback){
    var database = applicationStorage.getDatabase();

    database.search("character-ads", {}, {_id: 0}, 5, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

module.exports.getUserCharacterAds = function(id,callback){
    var database = applicationStorage.getDatabase();

    database.search("character-ads", {id:id}, {_id: 0}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};