"use strict";

var async = require("async");
var characterModel = process.require("characters/characterModel.js");
var userService = process.require("users/userService.js");
var bnetAPI = process.require("core/api/bnet.js");

/**
 * Sanitize and set the user's id to the character
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.sanitizeAndSetId = function(region,realm,name,id,callback){
    async.waterfall([
        function(callback){
            bnetAPI.getCharacter(region,realm,name,[],function(error,character){
                callback(error,character);
            });
        },
        function(character,callback){
            characterModel.setId(region,character.realm,character.name,id,function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Validate perm an upsert character Ad
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param ad
 * @param callback
 */
module.exports.checkPermsAndUpsertAd = function(region,realm,name,id,ad,callback){
    async.waterfall([
        function(callback){

        },
        function(callback){
            //Sanitize
        },
        function(callback){
            //Insert Ads
        },
        function(callback){
            //Set ID
        }
    ])
};
