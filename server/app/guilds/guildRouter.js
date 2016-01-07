"use strict";
var async = require("async");
var router = require("express").Router();
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var guildCriteria = process.require("guilds/utilities/mongo/guildCriteria.js");
var guildProjection = process.require("guilds/utilities/mongo/guildProjection.js");
var numberLimit = process.require("core/utilities/mongo/numberLimit.js");

/**
 * Return guilds
 * @param req
 * @param res
 */
function getGuilds(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));

    async.waterfall([
        function (callback) {
            guildCriteria.get(req.query, function (error, criteria) {
                callback(error, criteria);
            });
        },
        function(criteria,callback){
            callback(null,criteria,guildProjection.get(req.query));
        },
        function(criteria,projection,callback){
            callback(null,criteria,projection,numberLimit.get(req.query));
        },
        function(criteria,projection,limit,callback){
            callback(null,criteria,projection,limit,{'ad.updated':-1});
        },
        function(criteria,projection,limit,sort,callback){
            logger.debug("criteria:%s projection:%s limit:%s sort:%s",JSON.stringify(criteria), JSON.stringify(projection), JSON.stringify(limit), JSON.stringify(sort));
            async.parallel({
                guilds: function(callback){
                    if(limit > 0){
                        guildModel.find(criteria,projection).sort(sort).limit(limit).exec(function(error,guilds){
                            callback(error,guilds);
                        });
                    }
                    else{
                        callback(null,[]);
                    }
                },
                count : function(callback){
                    guildModel.count(criteria,function(error,count){
                        callback(error,count);
                    });
                }
            },function(error,results){
                callback(error,results);
            });
        }

    ],function(error,results){
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