"use strict";
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildModel = process.require("guilds/guildModel.js");
var guildCriteria = process.require("guilds/utilities/mongo/guildCriteria.js");
var guildProjection = process.require("guilds/utilities/mongo/guildProjection.js");
var numberLimit = process.require("core/utilities/mongo/numberLimit.js");
var guildSort = process.require("guilds/utilities/mongo/guildSort.js");
var guildService = process.require("guilds/guildService.js");
var updateModel = process.require("updates/updateModel.js");

/**
 * Return guilds
 * @param req
 * @param res
 */
module.exports.getGuilds= function(req,res) {
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
            callback(null,criteria,projection,limit,guildSort.get(req.query));
        },
        function(criteria,projection,limit,sort,callback){
            logger.debug("guilds - criteria:%s projection:%s limit:%s sort:%s",JSON.stringify(criteria), JSON.stringify(projection), JSON.stringify(limit), JSON.stringify(sort));
            async.parallel({
                guilds: function(callback){
                    if(limit > 0){
                        guildModel.find(criteria,projection,sort,limit,function(error,guilds){
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
            res.status(500).send(error.message);
        }
        res.setHeader('X-Total-Count',results.count);
        res.json(results.guilds);
    });
};

/**
 * return one guild
 * @param req
 * @param res
 * @param next
 */
module.exports.getGuild = function(req,res,next){

    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));

    var criteria = {region:req.params.region,realm:req.params.realm,name:req.params.name};
    var projection = {_id:0};
    guildModel.findOne(criteria,projection,function(error,guild){
        if(error){
            logger.error(error.message);
            res.status(500).send(error.message);
        }

        if (guild) {
            res.json(guild);
        }
        else {
            next();
        }
    });
};

/**
 * Put guild
 * @param req
 * @param res
 */
module.exports.putGuildAd = function(req,res){
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));
    var ad = req.body;

    async.series([
        function(callback){
            guildModel.upsertAd(req.params.region, req.params.realm, req.params.name, ad, function (error) {
                callback(error);
            });
        },
        function(callback){
            updateModel.insert("gu",req.params.region, req.params.realm, req.params.name, 10,function(error){
                callback(error);
            });
        }
    ],function(error){
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });
};


/**
 * Delete Guild AD
 * @param req
 * @param res
 */
module.exports.deleteGuildAd = function(req,res){
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));
    guildModel.deleteAd(req.params.region, req.params.realm, req.params.name, function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });

};

/**
 * Put guild
 * @param req
 * @param res
 */
module.exports.putGuildPerms = function(req,res){
    var logger = applicationStorage.logger;
    logger.verbose("%s %s %s", req.method, req.path, JSON.stringify(req.params));
    var perms = req.body;
    guildModel.upsertPerms(req.params.region, req.params.realm, req.params.name, perms, function (error) {
        if (error) {
            logger.error(error.message);
            res.status(500).send(error.message);
        } else {
            res.json();
        }
    });

};
