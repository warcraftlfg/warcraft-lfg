"use strict"

//Module dependencies
var applicationStorage = process.require("app/api/applicationStorage");

/**
 * Defines a model class to manipulate guild updates
 * @constructor
 */
function GuildUpdateModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = GuildUpdateModel;

/**
 * Insert if he doesn't exist a guild in collection guild-updates
 * @param region Region of the character
 * @param realm Realm of the character
 * @param name Realm of the character
 * @param callback Callback of the function
 */
GuildUpdateModel.prototype.add = function(region,realm,name,callback) {
    this.database.InsertOrUpdate("guild-updates", {region:region,realm:realm,name:name} ,{region:region,realm:realm,name:name}, function(error,result){
        callback(error, result);
    });
};

/**
 * Remove a guild of the collection guild-updates
 * @param region Region of the character
 * @param realm Realm of the character
 * @param name Realm of the character
 * @param callback Callback of the function
 */
GuildUpdateModel.prototype.remove = function(character,callback){
    this.database.remove("guild-updates",character,function(error,result){
        callback(error,result);
    });
};

/**
 * Get older guild of the collection guild-updates
 * @param callback
 */
GuildUpdateModel.prototype.getOlder = function(callback){
    this.database.search("guild-updates", {}, {}, 1, 1, {_id:1}, function(error,result){
        callback(error, result[0]);
    });

}

