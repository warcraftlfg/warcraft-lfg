"use strict";

//Module dependencies
var async = require("async");
var applicationStorage = process.require("api/applicationStorage.js");
var UserModel = process.require("models/UserModel.js");

//Configuration
var userModel = new UserModel();

/**
 * Defines a model class to manipulate characters
 * @constructor
 */
function CharacterAdModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = CharacterAdModel;

CharacterAdModel.prototype.add = function(id,characterAd,callback) {
    var self=this;
    userModel.getUserCharacters(characterAd.region,id, function (error,characters) {
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
            self.database.InsertOrUpdate("character-ads", {region:characterAd.region,realm:characterAd.realm,name:characterAd.name} ,characterAd, function(error,result){
                callback(error, result);
            });
        }
        else
        {
            callback(new Error("CHARACTER_NOT_MEMBER_ERROR"));
        }
    });
};

CharacterAdModel.prototype.get = function(characterAd,callback){
    this.database.get("character-ads",{"region":characterAd.region,"realm":characterAd.realm,"name":characterAd.name},{},1,function(error,characterAd){
        callback(error, characterAd && characterAd[0]);
    });
};

CharacterAdModel.prototype.getLast = function(callback){
    this.database.search("character-ads", {}, {}, 5, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};

CharacterAdModel.prototype.getUserCharacterAds = function(id,callback){
    this.database.search("character-ads", {id:id}, {}, -1, 1, {updated:-1}, function(error,result){
        callback(error, result);
    });
};