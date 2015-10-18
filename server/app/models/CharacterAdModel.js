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
            self.database.insertOrUpdate("character-ads", {region:characterAd.region,realm:characterAd.realm,name:characterAd.name} ,characterAd, function(error,result){
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
    var self = this;
    self.database.get("character-ads",{"region":characterAd.region,"realm":characterAd.realm,"name":characterAd.name},{},1,function(error,characterAd){
        if (error) {
            callback(error);
            return;
        }
        characterAd = characterAd[0];
        self.database.get("users",{id: characterAd.id},{_id: 0, accessToken: 0},1,function(error,user) {
            characterAd.user = user[0];

            //TODO Faire un mapReduce pour sélectionner Agréger les infos plutot que de tout renvoyer ...
            self.database.get("characters",{"region":characterAd.region,"realm":characterAd.realm,"name":characterAd.name},{},1,function(error,character) {
                if (error) {
                    callback(error);
                    return;
                }
                characterAd.character = character;
                callback(error, characterAd);
            });
        });
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