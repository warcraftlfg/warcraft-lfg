"use strict";
var async = require("async");
var lfgCriterion = process.require("core/utilities/mongo/criteria/lfgCriterion.js");
//var factionCriterion = process.require("guilds/utilities/mongo/criteria/factionCriterion.js");
var languagesCriterion = process.require("characters/utilities/mongo/criteria/languagesCriterion.js");
var raidsPerWeekCriterion = process.require("core/utilities/mongo/criteria/raidsPerWeekCriterion.js");
var dayCriterion = process.require("core/utilities/mongo/criteria/dayCriterion.js");
var progressCriterion = process.require("core/utilities/mongo/criteria/progressCriterion.js");
//var lastCriterion = process.require("guilds/utilities/mongo/criteria/lastCriterion.js");

var realmCriterion = process.require("core/utilities/mongo/criteria/realmCriterion.js");
var realmZoneCriterion = process.require("core/utilities/mongo/criteria/realmZoneCriterion.js");

module.exports.get = function(query,callback){

    var criteria = {};

    //Do sync stuff
    lfgCriterion.add(query,criteria);
    //factionCriterion.add(query,criteria);
    languagesCriterion.add(query,criteria);
    //recruitmentClassCriterion.add(query,criteria);
    raidsPerWeekCriterion.add(query,criteria);
    dayCriterion.add(query,criteria);
    progressCriterion.add(query,criteria);
    //lastCriterion.add(query,criteria);

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