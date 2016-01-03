"use strict";
var async = require("async");
var router = require("express").Router();
var applicationStorage = process.require("api/applicationStorage.js");
var guildService = process.require("guilds/guildService.js");
var lfgCriteria = process.require("params/criteria/lfgCriteria.js");
var factionCriteria = process.require("params/criteria/factionCriteria.js");
var realmCriteria = process.require("params/criteria/realmCriteria.js");
var guildViewProjection = process.require("params/projections/guildViewProjection.js");
var numberLimit = process.require("params/limits/numberLimit.js");

/**
 * Return characters
 * @param req
 * @param res
 */
function getGuilds(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));

    var criteria = {};

    var sort = {'ad.updated':-1};
    var limit = numberLimit.get(req.query);
    var projection = {region:1,realm:1,name:1};

    async.series([
        function(callback){
            //Call async criteria
            factionCriteria.add(req.query,criteria);
            lfgCriteria.add(req.query,criteria);
            guildViewProjection.add(req.query,projection);
            callback();
        },
        function(callback){
            //call async realmCriteria
            realmCriteria.add(req.query,criteria,function(){
                callback();
            });
        }
    ],function(){
        async.parallel({
            guilds: function(callback){
                if(limit > 0){
                    guildService.find(criteria,projection,sort,limit,function (error, guilds) {
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
    });
}

//Define routes
router.get("/guilds", getGuilds);

module.exports = router;