"use strict";
var async = require("async");
var router = require("express").Router();
var guildService = process.require("guilds/guildService.js");
var applicationStorage = process.require("api/applicationStorage.js");

/**
 * Return the last characters
 * @param req
 * @param res
 */
function getGuilds(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));
    var criteria = createGuildCriteria(req.query);
    var sort = {'ad.updated':-1};
    var limit = createLimit(req.query);

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

/**
 * Build the mongo criteria from url parameters
 * @param queryParams
 * @returns {{}}
 */
function createGuildCriteria(queryParams){
    var criteria = {};
    if(queryParams.lfg == 'true')
        criteria['ad.lfg'] = true;
    return criteria;
}

/**
 *
 * Get the limit of the request (max 10)
 * @param queryParams
 * @returns {number} max 10 default 5
 */
function createLimit(queryParams){
    if(queryParams.number)
        return queryParams.number>10?10:queryParams.number;
    else
        return 5;
}

//Define routes
router.get("/guilds", getGuilds);

module.exports = router;