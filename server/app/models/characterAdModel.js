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
        callback(error, characterAd && characterAd[0]);
    });
};

module.exports.getLast = function(number,callback){
    var number = number || 10;
    var database = applicationStorage.getDatabase();

    database.search("character-ads", {}, {_id: 0}, number, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};


module.exports.delete = function(id,characterAd,callback){
    var database = applicationStorage.getDatabase();
    database.remove("character-ads",{"region":characterAd.region,"realm":characterAd.realm,"name":characterAd.name,"id":id},function(error,characterAd){
        callback(error, characterAd);
    });
};

module.exports.getUserCharacterAds = function(id,callback){
    var database = applicationStorage.getDatabase();

    database.search("character-ads", {id:id}, {_id: 0}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

module.exports.getCount = function (callback){
    var database = applicationStorage.getDatabase();
    database.count('character-ads',function(error,count){

        callback(error,count);
    });
};