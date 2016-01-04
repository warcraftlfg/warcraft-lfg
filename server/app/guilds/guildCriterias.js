"use strict";
var lfgCriteria = process.require("params/criteria/lfgCriteria.js");
var factionCriteria = process.require("params/criteria/factionCriteria.js");
var realmCriteria = process.require("params/criteria/realmCriteria.js");

module.exports.get = function(query,callback){

    var criteria = {};

    //Do sync stuff
    factionCriteria.add(query,criteria);
    lfgCriteria.add(query,criteria);
    //TODO languageCriteria
    //TODO classRoleCriteria
    //TODO daysCriteria
    //TODO progressCriteria
    //TODO RaidsPerWeekCriteria

    //Do async stuff
    realmCriteria.add(query,criteria,function(error) {
        callback(error,criteria)
    });

};