"use strict"

//Module dependencies
var applicationStorage = process.require("app/api/applicationStorage");

/**
 * Defines a model class to manipulate characters Updates
 * @constructor
 */
function CharacterUpdateModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = CharacterUpdateModel;

/**
 * Insert if he doesn't exist a character in collection character-updates
 * @param region Region of the character
 * @param realm Realm of the character
 * @param name Realm of the character
 * @param callback Callback of the function
 */
CharacterUpdateModel.prototype.add = function(region,realm,name,callback) {
    this.database.InsertOrUpdate("character-updates", {region:region,realm:realm,name:name} ,{region:region,realm:realm,name:name}, function(error,result){
        callback(error, result);
    });
};

/**
 * Remove a character of the collection character-updates
 * @param region Region of the character
 * @param realm Realm of the character
 * @param name Realm of the character
 * @param callback Callback of the function
 */
CharacterUpdateModel.prototype.remove = function(character,callback){
    this.database.remove("character-updates",character,function(error,result){
        callback(error,result);
    });
};

/**
 * Get older guidl of the collection character-updates
 * @param callback
 */
CharacterUpdateModel.prototype.getOlder = function(callback){
    this.database.search("character-updates", {}, {}, 1, 1, {_id:1}, function(error,result){
        callback(error, result[0]);
    });

}

