"use strict"

//Module dependencies
var async = require("async");
var applicationStorage = process.require("app/api/applicationStorage");
var bnetAPI = process.require("app/api/bnet.js");
var CharacterUpdateModel = process.require("app/models/CharacterUpdateModel.js");
var logger = process.require("app/api/logger.js").get("wow-guild-recruitment");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('/app/config/config.'+env+'.json');
var characterUpdateModel = new CharacterUpdateModel();


/**
 * Defines a model class to manipulate users
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
            //Create User
            self.add(user,function(error,result){
                self.importUserCharactersAndGuilds(user.accessToken);
                delete user.accessToken;
                callback(user);
            });
        }
        else {
            //Update user
            self.update(user,function(error,data){
                self.importUserCharactersAndGuilds(user.accessToken);
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
    this.database.insert("users", user, function(error,result){
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

UserModel.prototype.getCharacters = function(id,region,callback){
    this.getAccessToken(id,function(error,accessToken){
        bnetAPI.getUserCharacters(region,accessToken,function(characters){
            var charactersFilter = {};
            //Fetch all characters
            async.forEach(characters,function(character,callback){
                if (character.level == 100)
                    charactersFilter[character.name+character.realm] = {name: character.name, realm: character.realm, region: region, level: character.level}
                callback();
            });
            //Remove Key
            var arr = Object.keys(charactersFilter).map(function (key) {return charactersFilter[key]});
            callback(arr);
        });
    })
}


UserModel.prototype.importUserCharactersAndGuilds= function(accessToken){
    config.bnet_regions.forEach(function(region) {
        bnetAPI.getUserCharacters(region, accessToken, function (characters) {
            characters.forEach(function (character){
                if (character.level == 100) {
                    characterUpdateModel.add(region,character.realm,character.name, function (error, result) {
                        logger.info("Insert to update character "+ character.name+"-"+character.realm+"-"+region)
                    });
                }
            });
        });
    });
}