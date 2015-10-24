"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var CharacterUpdateModel = process.require("models/CharacterUpdateModel.js");
var CharacterModel = process.require("models/CharacterModel.js");

module.exports.updateLastCharacter = function(callback){
    var self=this;
    CharacterUpdateModel.getOlder(function(error,characterUpdate) {
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
    var region = characterUpdate.get("region");
    var realm = characterUpdate.get("realm");
    var name = characterUpdate.get("name");

    characterUpdate.delete(function (error) {
        if (error) {
            callback(error);
            return;
        }
        bnetAPI.getCharacter(region, realm, name, function (error, character) {
            if (error) {
                callback();
                return;
            }
            character.region = region;
            new CharacterModel(character).save(function (error, character) {
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update character: ' + character.get("region") + "-" + character.get("realm") + "-" + character.get("name"));
                callback(null,character);
            });
        });
    });
};