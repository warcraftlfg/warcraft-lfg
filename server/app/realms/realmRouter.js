"use strict";
var router = require("express").Router();
var applicationStorage = process.require("api/applicationStorage.js");
var realmService = process.require("realms/realmService.js");
var realmZonesCriteria =  process.require("params/criteria/realmZonesCriteria.js");

/**
 * Return the realms
 * @param req
 * @param res
 */
function getRealms(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));
    var criteria = {};
    realmZonesCriteria.add(req.query,criteria);
    realmService.find(criteria,function (error, realms) {
        if(error){
            logger.error(error.message);
            res.status(500).send();
        }
        res.json(realms);
    });
}


//Define routes
router.get("/realms", getRealms);

module.exports = router;