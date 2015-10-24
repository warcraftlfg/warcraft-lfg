"use strict";

//Defines dependencies
var userSchema = process.require('config/db/userSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();

/**
 * Defines a model class to manipulate users
 * @constructor
 */
function UserModel(data){
    this.data =  this.sanitize(data);
    this.database = applicationStorage.getDatabase();
}

UserModel.prototype.data = {};

UserModel.prototype.get = function(name){
    return this.data[name];
};

UserModel.prototype.sanitize = function(data){
    return confine.normalize(data,userSchema);
};

UserModel.prototype.save = function (callback) {
    var self = this;

    //Sanitize json
    this.data =  this.sanitize(this.data);

    //Check for required attributes
    if(this.data.id == null){
        callback(new Error('Field id is required in GuildModel'));
        return;
    }
    if(this.data.battleTag == null){
        callback(new Error('Field battleTag is required in GuildModel'));
        return;
    }
    if(this.data.accessToken == null){
        callback(new Error('Field accessToken is required in GuildModel'));
        return;
    }

    //Create or update user
    this.database.insertOrUpdate("users", {id: self.data.id}, self.data, function (error) {
        callback(error, self);
    });

};

UserModel.findById = function (id,callback){
    var database = applicationStorage.getDatabase();
    database.get("users",{id:id},{_id: 0},1,function(error,data){
        if(error) {
            callback(error);
            return;
        }
        if(data.length == 0 ) {
            callback(new Error('User ' + id + ' not found'));
            return;
        }
        callback(null, new UserModel(data[0]));
    });
};

module.exports = UserModel;


