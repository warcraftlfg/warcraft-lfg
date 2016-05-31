"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");
var realmModel = process.require("realms/realmModel.js");
var realmZoneCriterion = process.require("realms/utilities/mongo/criteria/realmZoneCriterion.js");

/**
 * Return the realms
 * @param req
 * @param res
 */
module.exports.getRealms = function (req, res) {
    var logger = applicationStorage.logger;
    var criteria = {};
    realmZoneCriterion.add(req.query, criteria);
    var projection = {name: 1, region: 1, "_id": 0};
    var sort = {name: 1, region: 1};

    logger.info("%s %s %s %s",  req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params));

    realmModel.find(criteria, projection, sort, function (error, realms) {
        if (error) {
            logger.error(error.message);
            res.status(500).send();
        }
        res.json(realms);
    });
};