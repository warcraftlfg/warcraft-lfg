"use strict";

var async = require("async");
var characterModel = process.require("characters/characterModel.js");
var bnetAPI = process.require("api/bnet.js");

/**
 * Sanitize and set the user's id to the character
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.setId = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            bnetAPI.getCharacter(region,realm,name,[],function(error,character){
                callback(error,character);
            });
        },
        function(character,callback){
            characterModel.upsert(
                {region:region,realm:character.realm,name:character.name},
                {region:region,realm:character.realm,name:character.name,id:id},
                function(error){
                    callback(error);
                });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Return the characters
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param callback
 */
module.exports.find = function(criteria,projection,sort,limit,callback){
    characterModel.find(criteria,projection).sort(sort).limit(limit).exec(function(error,characters){
        callback(error,characters);
    });
};

/**
 * Return the number of characters
 * @param criteria
 * @param callback
 */
module.exports.count = function(criteria,callback){
    characterModel.count(criteria,function(error,guildLFGCount){
        callback(error,guildLFGCount);
    });
};