"use strict"

//Module dependencies
var async = require("async");
var applicationStorage = process.require("app/api/applicationStorage");
var bnetAPI = process.require("app/api/bnet.js");


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

UserModel.prototype.getAccessToken = function(id,callback){
    this.database.get("users",{id: id},{},1,function(error,user){
        callback(error, user && user[0].accessToken);
    });
}

UserModel.prototype.getGuilds = function(id,region,callback){
    this.getAccessToken(id,function(error,accessToken){
        bnetAPI.getUserCharacters(region,accessToken,function(characters){
            var guilds = {};
            //Fetch all characters and keep guild
            async.forEach(characters,function(character,callback){
                if(character.guild)
                    guilds[character.guild+character.guildRealm] = {name: character.guild, realm: character.guildRealm, region: region}
                callback();
            });
            //Remove Key
            var arr = Object.keys(guilds).map(function (key) {return guilds[key]});
            callback(arr);
        });
    })

}