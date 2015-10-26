"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var characterUpdateModel = process.require("models/CharacterUpdateModel.js");
var characterAdModel = process.require("models/CharacterAdModel.js");
var characterModel = process.require("models/CharacterModel.js");
var applicationStorage = process.require("api/applicationStorage.js");

module.exports.updateLastCharacter = function(callback){
    var self=this;
    characterUpdateModel.getOldest(function(error,characterUpdate) {
        if (error) {
            callback(error);
            return;
        }
        if (characterUpdate) {
            self.updateCharacter(characterUpdate, function (error,character) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(error,character);
            });
        }
        else
            callback();
    });
};

module.exports.updateCharacter = function(characterUpdate,callback) {
    var self = this;
    characterUpdateModel.delete(characterUpdate,function (error) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getCharacter(characterUpdate.region, characterUpdate.realm, characterUpdate.name, function (error, character) {
            if (error) {
                callback();
                return;
            }
            character.region = characterUpdate.region;
            characterModel.insertOrUpdate(character,function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update character: ' + character.region + "-" + character.realm + "-" + character.name);

                if(result.result.nModified==0)
                    self.emitCount();

                callback(null,character);
            });
        });
    });
};

module.exports.getCount = function(callback){
    characterModel.getCount(function(error,count){
        callback(error,count);
    });
};

module.exports.emitCount = function(){
    //Dispatch count to all users if new
    this.getCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var socketIo = applicationStorage.getSocketIo();
        socketIo.emit('get:characterCount', count);
    });
};

module.exports.getCharacterData = function(characterData,callback){

    //Merge All Datas
    characterAdModel.get({region:characterData.region,realm:characterData.realm,name:characterData.name},function(error,characterAd){
        if(error){
            callback(error);
            logger.error(error.message);
            return;
        }
        characterData.characterAd = characterAd;
        characterModel.get({region:characterData.region,realm:characterData.realm,name:characterData.name},function(error,character) {
            if (error) {
                callback(error);
                logger.error(error.message);
                return;
            }
            characterData.character = character;
            callback(null,characterData);
        });
    });
};

module.exports.getCharactersData = function (recruit,callback){

    var charactersData ={};
    if(recruit){
        characterAdModel.getLast(-1,function(error,characterAds){
            if (error) {
                callback(error);
                logger.error(error.message);
                return;
            }
            charactersData = characterAds;
            callback(error,charactersData);
        });
    }
    else{
        characterModel.getLast(-1,function(error,characters){
            if (error) {
                callback(error);
                logger.error(error.message);
                return;
            }
            charactersData = characters;
            callback(error,characters);
        })
    }
};