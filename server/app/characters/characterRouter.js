"use strict";

var async = require("async");
var router = require("express").Router();
var characterService = process.require("characters/characterService.js");
var applicationStorage = process.require("api/applicationStorage.js");

/**
 * Return characters
 * @param req
 * @param res
 */
function getCharacters(req,res) {
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.query));
    var criteria = createCharacterCriteria(req.query);
    var sort = {'ad.updated':-1};
    var limit = createLimit(req.query);


    async.parallel({
        characters: function(callback){
            if(limit > 0){
                characterService.find(criteria,sort,limit,function (error, characters) {
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
/**
 * Build the mongo criteria from url parameters
 * @param queryParams
 * @returns {{}}
 */
function createCharacterCriteria(queryParams){
    var criteria = {};
    if(queryParams.lfg == 'true')
        criteria['ad.lfg'] = true;
    return criteria;
}

/**
 * Get the limit of the request
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
router.get("/characters", getCharacters);

module.exports = router;