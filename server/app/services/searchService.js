"use strict";
var guildModel = process.require("models/guildModel.js");
var characterModel = process.require("models/characterModel.js");
var async = require("async");

module.exports.search = function(search,callback){


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
