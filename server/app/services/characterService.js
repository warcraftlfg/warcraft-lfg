"use strict";

//Module dependencies
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var characterUpdateModel = process.require("models/characterUpdateModel.js");
var characterModel = process.require("models/characterModel.js");
var applicationStorage = process.require("api/applicationStorage.js");
var userService = process.require("services/userService.js");
var async = require("async");

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

            characterModel.insertOrUpdateBnet(characterUpdate.region,character.realm,character.name,character,function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                logger.info('insert/update character: ' + characterUpdate.region + "-" + character.realm + "-" + character.name);

                if(result.result.nModified==0)
                    self.emitCount();

                callback(null,character);
            });
        });
    });
};



module.exports.emitCount = function(){
    //Dispatch count to all users if new
    characterModel.getCount(function(error,count){
        if (error){
            logger.error(error.message);
            return;
        }
        var socketIo = applicationStorage.getSocketIo();
        socketIo.emit('get:characterCount', count);
    });
};

module.exports.isOwner = function (id,region,realm,name,callback){
    userService.getCharacters(region,id,function (error,characters) {
        if (error) {
            callback(error);
            return;
        }
        var isMyCharacter = false;
        async.forEach(characters, function (character, callback) {
            if (character.name == name && character.realm == realm)
                isMyCharacter = true;
            callback();
        });
        callback(error,isMyCharacter);
    });
};

module.exports.addCharacterUpdate = function (region, realm, name){
    characterUpdateModel.insertOrUpdate({region:region,realm:realm,name:name},function(error){
        if (error) {
            logger.error(error.message);
            return;
        }
        logger.info("Insert character to update "+ region +"-"+realm+"-"+name);
    });
};