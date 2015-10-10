"use strict"

//Module dependencies
var applicationStorage = process.require("app/api/applicationStorage");

/**
 * Defines a UserModel class to manipulate users
 * @constructor
 */
function UserModel(){
    this.database= applicationStorage.getDatabase();
}

module.exports = UserModel;

UserModel.prototype.findOrCreateOauthUser = function (user,callback){
    var self = this;

    this.findById(user.id,function(error,result){
        if(result==null){
            self.add(user,function(error,result){
                    delete user.accessToken;
                    callback(user);

            });
        }
        else {
            self.update(user,function(error,data){
                callback(result);

            });
        }
    });

};

UserModel.prototype.findById = function (id,callback){
    this.database.get("users",{id: id},{_id: 0, accessToken: 0},1,function(error,user){
        callback(error, user && user[0]);
    });
};


UserModel.prototype.add = function (user,callback){
    this.database.insertMany("users", [user], function(error,result){
        callback(error, result);
    });
};


UserModel.prototype.update = function (user,callback){
    this.database.update("users", {id: user.id},user, function(error,result){
        callback(error, result);
    });
};