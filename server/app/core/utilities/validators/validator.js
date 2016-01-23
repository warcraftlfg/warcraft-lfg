"use strict";

var async = require("async");
var regionValidator = process.require("core/utilities/validators/regionValidator.js");
var realmValidator = process.require("core/utilities/validators/realmValidator.js");
var nameValidator = process.require("core/utilities/validators/nameValidator.js");
var idValidator = process.require("core/utilities/validators/idValidator.js");
var raidValidator = process.require("core/utilities/validators/raidValidator.js");
var bossValidator = process.require("core/utilities/validators/bossValidator.js");
var bossWeightValidator = process.require("core/utilities/validators/bossWeightValidator.js");
var difficultyValidator = process.require("core/utilities/validators/difficultyValidator.js");
var timestampValidator = process.require("core/utilities/validators/timestampValidator.js");
var sourceValidator = process.require("core/utilities/validators/sourceValidator.js");


module.exports.validate = function (params, callback) {

    async.series([
        function (callback) {
            if (params.hasOwnProperty("region")) {
                regionValidator.validate(params.region, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("realm")) {
                realmValidator.validate(params.realm, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("name")) {
                nameValidator.validate(params.name, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("id")) {
                idValidator.validate(params.id, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("raid")) {
                raidValidator.validate(params.raid, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("boss")) {
                bossValidator.validate(params.boss, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("bossWeight")) {
                bossWeightValidator.validate(params.bossWeight, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("difficulty")) {
                difficultyValidator.validate(params.difficulty, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("timestamp")) {
                timestampValidator.validate(params.timestamp, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        },
        function (callback) {
            if (params.hasOwnProperty("source")) {
                sourceValidator.validate(params.source, function (error) {
                    callback(error);
                });
            }
            else {
                callback();
            }
        }
    ], function (error) {
        callback(error);
    });


};
