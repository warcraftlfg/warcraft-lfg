"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var characterUpdateModel = process.require("models/CharacterUpdateModel.js");
var characterModel = process.require("models/CharacterModel.js");

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
            characterModel.insertOrUpdate(character,function (error, character) {
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update character: ' + character.region + "-" + character.realm + "-" + character.name);
                callback(null,character);
            });
        });
    });
};