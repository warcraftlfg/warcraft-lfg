"use strict"

//Defines dependencies
var characterSchema = process.require('config/db/characterSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();

/**
 * Defines a model class to manipulate characters
 * @constructor
 */
function CharacterModel(data){
    this.data = this.sanitize(data);
    this.database = applicationStorage.getDatabase();
}

CharacterModel.prototype.data = {};

CharacterModel.prototype.get = function(name){
    return this.data[name];
};

CharacterModel.prototype.sanitize = function(data){
    return confine.normalize(data,characterSchema);
};

CharacterModel.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);

    //Check for required attributes
    if(this.data.region == null){
        callback(new Error('Field region is required in CharacterModel'));
        return;
    }
    if(this.data.realm == null){
        callback(new Error('Field realm is required in CharacterModel'));
        return;
    }
    if(this.data.name == null){
        callback(new Error('Field name is required in CharacterModel'));
        return;
    }

    //Create or update guild
    this.database.insertOrUpdate("characters",{region:self.data.region,realm:self.data.realm,name:self.data.name},self.data, function(error){
        callback(error, self);
    });
};


module.exports = CharacterModel;