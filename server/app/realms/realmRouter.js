"use strict";
var async = require("async");
var router = require("express").Router();
var realmService = process.require("realms/realmService.js");
var applicationStorage = process.require("api/applicationStorage.js");

/**
 * Return the realms
 * @param req
 * @param res
 */
function getRealms(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));
    var criteria = createRealmCriteria(req.query);

    realmService.find(criteria,function (error, realms) {
        if(error){
            logger.error(error.message);
            res.status(500).send();
        }
        res.json(realms);
    });
}

/**
 * Build the mongo criteria from url parameters
 * @param queryParams
 * @returns {{}}
 */
function createRealmCriteria(queryParams){
    var criteria = {};
    return criteria;
}

//Define routes
router.get("/realms", getRealms);

module.exports = router;