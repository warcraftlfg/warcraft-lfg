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

CharacterUpdateModel.prototype.add = function(region,realm,name,callback) {
    this.database.InsertOrUpdate("character-updates", {region:region,realm:realm,name:name} ,{region:region,realm:realm,name:name}, function(error,result){
        callback(error, result);
    });
}

