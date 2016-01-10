"use strict";

//Load dependenciesw
var applicationStorage = process.require("core/applicationStorage.js");
var realmModel = process.require("realms/realmModel.js");
var realmZoneCriterion =  process.require("realms/utilities/mongo/criteria/realmZoneCriterion.js");

/**
 * Return the realms
 * @param req
 * @param res
 */
module.exports.getRealms = function(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));
    var criteria = {};
    realmZoneCriterion.add(req.query,criteria);
    var projection = {name:1,region:1,"_id":0};
    var sort = {name:1,region:1};

    logger.debug("realms - criteria:%s projection:%s sort:%s",JSON.stringify(criteria), JSON.stringify(projection), JSON.stringify(sort));
    realmModel.find(criteria,projection).sort(sort).exec(function(error,realms){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        }
        res.json(realms);
    });
};