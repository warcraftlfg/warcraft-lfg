"use strict";
var async = require("async");
var lfgCriterion = process.require("core/db/criteria/lfgCriterion.js");
var realmCriterion = process.require("core/db/criteria/realmCriterion.js");
var realmZoneCriterion = process.require("core/db/criteria/realmZoneCriterion.js");
var factionCriterion = process.require("guilds/db/criteria/factionCriterion.js");
module.exports.get = function(query,callback){

    var criteria = {};

    //Do sync stuff
    lfgCriterion.add(query,criteria);
    factionCriterion.add(query,criteria);
    //TODO languageCriteria
    //TODO classRoleCriteria
    //TODO daysCriteria
    //TODO progressCriteria
    //TODO RaidsPerWeekCriteria

    //Do async stuff
    async.series([
        function(callback){
            realmCriterion.add(query,criteria,function(error) {
                callback(error);
            });
        },
        function(callback){
            realmZoneCriterion.add(query,criteria,function(error) {
                callback(error);
            });
        }
    ],function(error){
        callback(error,criteria)
    });


};