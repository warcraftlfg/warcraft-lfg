"use strict";

//Defines dependencies
var characterUpdateSchema = process.require('config/db/characterUpdateSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();

/**
 * Defines a model class to manipulate characters Updates
 * @constructor
 */
function CharacterUpdateModel(data){
    this.data = this.sanitize(data);
    this.database = applicationStorage.getDatabase();
}

CharacterUpdateModel.prototype.data = {};

CharacterUpdateModel.prototype.get = function(name){
    return this.data[name];
};

CharacterUpdateModel.prototype.sanitize = function(data){
    return confine.normalize(data,characterUpdateSchema);
};

CharacterUpdateModel.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);

    //Check for required attributes
    if(this.data.region == null){
        callback(new Error('Field region is required in CharacterUpdateModel'));
        return;
    }
    if(this.data.realm == null){
        callback(new Error('Field realm is required in CharacterUpdateModel'));
        return;
    }
    if(this.data.name == null){
        callback(new Error('Field name is required in CharacterUpdateModel'));
        return;
    }

    //Create or update guildUpdate
    this.database.insertOrUpdate("character-updates",{region:self.data.region,realm:self.data.realm,name:self.data.name},self.data, function(error){
        callback(error, self);
    });
};

CharacterUpdateModel.prototype.delete = function (callback) {
    var self=this;
    this.database.remove("character-updates",self.data,function(error){
        self.data = null;
        callback(error);
    });
};

CharacterUpdateModel.getOlder = function (callback){
    var database = applicationStorage.getDatabase();
    database.search("character-updates", {}, {}, 1, 1, {_id:1}, function(error,data){
        if(error) {
            callback(error);
            return;
        }
        if(data.length == 0 ) {
            callback (null,null);
            return;
        }
        callback(null, new CharacterUpdateModel(data[0]));
    });
};

module.exports = CharacterUpdateModel;