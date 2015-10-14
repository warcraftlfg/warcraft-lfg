"use strict"

//Module dependencies
var applicationStorage = process.require("app/api/applicationStorage");

/**
 * Defines a model class to manipulate characters
 * @constructor
 */
function CharacterModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = CharacterModel;

CharacterModel.prototype.add = function(region,character,callback) {
    character.region = region;
    this.database.InsertOrUpdate("characters", {region:character.region,realm:character.realm,name:character.name} ,character, function(error,result){
        callback(error, result);
    });
};



