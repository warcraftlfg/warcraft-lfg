"use strict";

var realmModel = process.require("realms/realmModel.js");

/**
 * Return the last realms
 * @param criteria
 * @param callback
 */
module.exports.find = function(criteria,callback){
    realmModel.find(criteria,{name:1,region:1,"_id":0}).sort({name:1,region:1}).exec(function(error,guilds){
        callback(error,guilds);
    });
};
