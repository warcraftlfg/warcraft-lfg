"use strict";
var async = require("async");
var router = require("express").Router();
var applicationStorage = process.require("api/applicationStorage.js");
var guildService = process.require("guilds/guildService.js");
var lfgCriteria = process.require("params/criteria/lfgCriteria.js");
var numberParam = process.require("params/numberParam.js");

/**
 * Return characters
 * @param req
 * @param res
 */
function getGuilds(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));

    var criteria = {};
    lfgCriteria.add(req.query,criteria);

    var sort = {'ad.updated':-1};
    var limit = numberParam.get(req.query);

    async.parallel({
        guilds: function(callback){
            if(limit > 0){
                guildService.find(criteria,sort,limit,function (error, guilds) {
                    callback(error,guilds);
                });
            }
            else{
                callback(null,[]);
            }
        },
        count : function(callback){
            guildService.count(criteria,function (error, count) {
                callback(error,count);

            });
        }
    },function(error,results){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        }
        res.setHeader('X-Total-Count',results.count);
        res.json(results.guilds);
    });

}

//Define routes
router.get("/guilds", getGuilds);

module.exports = router;