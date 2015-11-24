"use strict";
var guildModel = process.require("models/guildModel.js");
var characterModel = process.require("models/characterModel.js");
var realmModel = process.require("models/realmModel.js");

var async = require("async");

module.exports.searchGuildsAndCharacters = function(search,callback){

    async.parallel({
        guilds : function(callback){
            guildModel.search(search,function(error,guilds) {
                if (error)
                    return callback(error);
                callback(null,guilds);
            });
        },
        characters :function(callback){
            characterModel.search(search,function(error,characters){
                if (error)
                    return callback(error);
                callback(null,characters);
            });
        }
    }, function(error,result){
        callback(error,result)
    });


};

module.exports.searchRealms = function(search,callback){

    realmModel.search(search,function(error,realms) {
        if (error)
            return callback(error);
        callback(null,realms);
    });

};
