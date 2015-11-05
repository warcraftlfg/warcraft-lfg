"use strict";
var guildModel = process.require("models/guildModel.js");
var characterModel = process.require("models/characterModel.js");
module.exports.search = function(search,callback){

    var result={};
    guildModel.search(search,function(error,guilds){
        if(error)
            return callback(error);

        result.guilds = guilds;
        characterModel.search(search,function(error,characters){
            result.characters = characters;
            callback(error,result);
        });
    });
};
