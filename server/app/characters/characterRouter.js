"use strict";

var async = require("async");
var router = require("express").Router();
var applicationStorage = process.require("core/applicationStorage.js");
var characterService = process.require("characters/characterService.js");
//var lfgCriteria = process.require("core/params/lfgParam.js");
//var numberLimit = process.require("core/params/numberParam.js");

/**
 * Return characters
 * @param req
 * @param res
 */
function getCharacters(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));

    var criteria = {};
   // lfgCriteria.add(req.query,criteria);

    var projection = {name:1,realm:1,region:1,"ad.updated":1,"bnet.class":1,"_id":0};
    var sort = {'ad.updated':-1};
   // var limit = numberLimit.get(req.query);
        var limit = 5;

    async.parallel({
        characters: function(callback){
            if(limit > 0){
                characterService.find(criteria,projection,sort,limit,function (error, characters) {
                    callback(error,characters);
                });
            }
            else{
                callback(null,[]);
            }
        },
        count : function(callback){
            characterService.count(criteria,function (error, count) {
                callback(error,count);
            });

        }
    },function(error,results){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        }
        res.setHeader('X-Total-Count',results.count);
        res.json(results.characters);
    });

}

//Define routes
router.get("/characters", getCharacters);

module.exports = router;