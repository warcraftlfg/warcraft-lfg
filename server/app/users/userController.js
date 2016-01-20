"use strict";

//Load dependencies
var applicationStorage = process.require("core/applicationStorage.js");
var characterModel = process.require("characters/characterModel.js");
var guildModel = process.require("guilds/guildModel.js");
var userService = process.require("users/userService.js");


/**
 * Logout function for express
 * @param req
 * @param res
 */
module.exports.logout = function(req, res){
    req.logout();
    res.redirect('/');
};

/**
 * Get the user informations
 * @param reqapplicationStorage.logger
 * @param res
 */
module.exports.getProfile = function(req,res){
    res.json(req.user);
};

/**
 *
 * @param req
 * @param res
 */
module.exports.getCharacterAds = function(req,res){
    var logger = applicationStorage.logger;
    var criteria = {id:req.user.id,"ad.lfg":{$exists:true}};
    var projection = {_id:0,name:1,realm:1,region:1,"ad.updated":1,"ad.lfg":1,"bnet.class":1};
    var sort = {"ad.updated":-1};
    characterModel.find(criteria,projection,sort,function(error,characters){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(characters);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
module.exports.getGuildAds = function(req,res){
    var logger = applicationStorage.logger;

    var criteria = {id:req.user.id,"ad.lfg":{$exists:true}};
    var projection = {_id:0,name:1,realm:1,region:1,"ad.updated":1,"ad.lfg":1,"bnet.side":1,"perms":1};
    var sort = {"ad.updated":-1};
    guildModel.find(criteria,projection,sort,function(error,guilds){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(guilds);
        }
    });

};

/**
 *
 * @param req
 * @param res
 */
module.exports.getCharacters = function(req,res){
    var logger = applicationStorage.logger;
    userService.getCharacters(req.params.region,req.user.id,function(error,characters){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(characters);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
module.exports.getGuilds = function(req,res){
    var logger = applicationStorage.logger;

    userService.getGuilds(req.params.region,req.user.id,function(error,guilds){
        if(error){
            logger.error(error.message);
            res.status(500).send();
        } else {
            res.json(guilds);
        }
    });

};


/**
 *
 * @param req
 * @param res
 */
module.exports.getGuildRank = function(req,res){
    var logger = applicationStorage.logger;

        userService.getGuildRank(req.params.region,req.params.realm,req.params.name,req.user.id,function(error,rank){
            if(error){
                logger.error(error.message);
                res.status(500).send();
            } else {
                res.json(rank);
            }
        });

};