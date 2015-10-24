"use strict";

//Defines dependencies
var characterUpdateSchema = process.require('config/db/characterUpdateSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();

module.exports.insertOrUpdate = function (characterUpdate,callback) {
    var database = applicationStorage.getDatabase();

    characterUpdate = confine.normalize(characterUpdate,characterUpdateSchema);

    //Check for required attributes
    if(characterUpdate.region == null){
        callback(new Error('Field region is required in CharacterUpdateModel'));
        return;
    }
    if(characterUpdate.realm == null){
        callback(new Error('Field realm is required in CharacterUpdateModel'));
        return;
    }
    if(characterUpdate.name == null){
        callback(new Error('Field name is required in CharacterUpdateModel'));
        return;
    }

    //Create or update guildUpdate
    database.insertOrUpdate("character-updates",{region:characterUpdate.region,realm:characterUpdate.realm,name:characterUpdate.name}, null, characterUpdate, function(error){
        callback(error, characterUpdate);
    });
};

module.exports.delete = function (characterUpdate,callback) {
    var database = applicationStorage.getDatabase();

    database.remove("character-updates",characterUpdate,function(error){
        callback(error);
    });
};

module.exports.getOldest = function (callback){
    var database = applicationStorage.getDatabase();
    database.search("character-updates", {}, {_id: 0}, 1, 1, {_id:1}, function(error,characterUpdate){
        if(error) {
            callback(error);
            return;
        }
        if(characterUpdate.length == 0 ) {
            callback (null,null);
            return;
        }

        callback(null, characterUpdate[0]);
    });
};
