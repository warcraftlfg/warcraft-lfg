"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");

/**
 * Insert new Guild Update
 * @param req
 * @param res
 */
module.exports.postUpdate = function (req, res) {
    var logger = applicationStorage.logger;

    var t


    async.waterfall([
        function (callback) {
            if (req.body.type === "character") {
                callback(null, "cu");
            } else if (req.body.type === "guild") {
                callback(null, "gu");

            } else {
                callback(Error('Missing/Wrong type param'));
            }
        },
        function (type, callback) {
            updateModel.insert(type, req.body.region, req.body.realm, req.body.name, 5, function (error) {
                callback(error, type);
            });
        },
        function (type, callback) {
            updateModel.getCount(type, 5, function (error, count) {
                callback(error, count);
            });
        }
    ], function (error, count) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json({count: count});
        }
    });

};

