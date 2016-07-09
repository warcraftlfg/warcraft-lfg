"use strict";

//Load dependencies
var async = require("async");

var lfgCriterion = process.require("core/utilities/mongo/criteria/lfgCriterion.js");
var factionCriterion = process.require("characters/utilities/mongo/criteria/factionCriterion.js");
var languagesCriterion = process.require("characters/utilities/mongo/criteria/languagesCriterion.js");
var raidsPerWeekCriterion = process.require("characters/utilities/mongo/criteria/raidsPerWeekCriterion.js");
var dayCriterion = process.require("characters/utilities/mongo/criteria/dayCriterion.js");
var progressCriterion = process.require("characters/utilities/mongo/criteria/progressCriterion.js");
var roleCriterion = process.require("characters/utilities/mongo/criteria/roleCriterion.js");
var classCriterion = process.require("characters/utilities/mongo/criteria/classCriterion.js");
var ilevelCriterion = process.require("characters/utilities/mongo/criteria/ilevelCriterion.js");
var transfertCriterion = process.require("characters/utilities/mongo/criteria/transfertCriterion.js");
var levelMaxCriterion = process.require("characters/utilities/mongo/criteria/levelMaxCriterion.js");
var lastCriterion = process.require("characters/utilities/mongo/criteria/lastCriterion.js");
var realmCriterion = process.require("core/utilities/mongo/criteria/realmCriterion.js");
var realmZoneCriterion = process.require("core/utilities/mongo/criteria/realmZoneCriterion.js");

/**
 * Return the criteria from query for characters
 * @param query
 * @param callback
 */
module.exports.get = function (query, callback) {

    var criteria = {};

    //Do sync stuff
    lfgCriterion.add(query, criteria);
    factionCriterion.add(query, criteria);
    languagesCriterion.add(query, criteria);
    raidsPerWeekCriterion.add(query, criteria);
    dayCriterion.add(query, criteria);
    progressCriterion.add(query, criteria);
    roleCriterion.add(query, criteria);
    classCriterion.add(query, criteria);
    lastCriterion.add(query, criteria);
    ilevelCriterion.add(query, criteria);
    transfertCriterion.add(query, criteria);
    levelMaxCriterion.add(query, criteria);

    //Do async stuff
    async.series([
        function (callback) {
            realmCriterion.add(query, criteria, function (error) {
                callback(error);
            });
        },
        function (callback) {
            realmZoneCriterion.add(query, criteria, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error, criteria)
    });
};