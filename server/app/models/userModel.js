"use strict";

//Defines dependencies
var userSchema = process.require('config/db/userSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();


module.exports.insertOrUpdate = function (user,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Sanitize json
    user =  confine.normalize(user,userSchema);

    //Check for required attributes
    if(user.id == null){
        callback(new Error('Field id is required in GuildModel'));
        return;
    }
    if(user.battleTag == null){
        callback(new Error('Field battleTag is required in GuildModel'));
        return;
    }
    if(user.accessToken == null){
        callback(new Error('Field accessToken is required in GuildModel'));
        return;
    }

    //Create or update user
    database.insertOrUpdate("users", {id: user.id}, null, user, function (error) {
        callback(error, user);
    });

};

module.exports.findById = function (id,callback){
    var database = applicationStorage.getMongoDatabase();
    database.get("users",{id:id},{_id: 0},1,function(error,user){
        if(error) {
            callback(error);
            return;
        }
        if(user.length == 0 ) {
            callback(new Error('User not found'));
            return;
        }
        callback(null, user[0]);
    });
};


