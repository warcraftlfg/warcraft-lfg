"use strict";

var async = require("async");
var router = require("express").Router();
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var characterCriteria = process.require("characters/utilities/mongo/characterCriteria.js");
var characterProjection = process.require("characters/utilities/mongo/characterProjection.js");
var numberLimit = process.require("core/utilities/mongo/numberLimit.js");
var characterSort = process.require("characters/utilities/mongo/characterSort.js");

/**
 * Return characters
 * @param req
 * @param res
 */
function getCharacters(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));

    async.waterfall([
        function (callback) {
            characterCriteria.get(req.query, function (error, criteria) {
                callback(error, criteria);
            });
        },
        function(criteria,callback){
            callback(null,criteria,characterProjection.get(req.query));
        },
        function(criteria,projection,callback){
            callback(null,criteria,projection,numberLimit.get(req.query));
        },
        function(criteria,projection,limit,callback){
            callback(null,criteria,projection,limit,characterSort.get(req.query));
        },
        function(criteria,projection,limit,sort,callback){
            logger.debug("characters - criteria:%s projection:%s limit:%s sort:%s",JSON.stringify(criteria), JSON.stringify(projection), JSON.stringify(limit), JSON.stringify(sort));
            async.parallel({
                guilds: function(callback){
                    if(limit > 0){
                        characterModel.find(criteria,projection).sort(sort).limit(limit).exec(function(error,guilds){
                            callback(error,guilds);
                        });
                    }
                    else{
                        callback(null,[]);
                    }
                },
                count : function(callback){
                    characterModel.count(criteria,function(error,count){
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


function getCharacter(req,res,next){

    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));

    var criteria = {region:req.params.region,realm:req.params.realm,name:req.params.name};
    var projection = {
        _id:0,
        id:1,
        region:1,
        realm:1,
        name:1,
        ad:1,
        updated:1,
        "bnet.faction":1,
        "bnet.class":1,
        "bnet.thumbnail":1,
        "bnet.guild.name":1,
        "bnet.race":1,
        "bnet.level":1,
        "bnet.talents":1,
        "bnet.progression.raids":{$slice:-1},
        "bnet.items":1,
        "bnet.reputation":1,
        "bnet.achievements":1,
        "bnet.challenge.records":1,
        "warcraftLogs.logs":1
    };
    characterModel.findOne(criteria,projection,function(error,guild){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        }

        if (guild) {
            res.json(guild);
        }
        else {
            next();
        }
    });
}

//Define routes
router.get("/characters", getCharacters);
router.get("/characters/:region/:realm/:name", getCharacter);

module.exports = router;