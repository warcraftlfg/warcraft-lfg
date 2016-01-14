"use strict";

var userService = process.require("users/userService.js");

/**
 * Check if user is authenticated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isAuthenticated = function (req, res, next){
    if (req.user)
        return next();
    res.status(403).send("ACCESS_DENIED");
};

/**
 * Check if user is owner of the character
 * @param req
 * @param res
 * @param next
 */
module.exports.isOwner = function (req,res,next){
    userService.isOwner(req.params.region,req.params.realm,req.params.name, req.user.id, function(error,isOwner){
        if(error){
            res.status(500).send(error.message);
        } else {
            if (isOwner)
                return next();
            res.status(403).send("ACCESS_DENIED");
        }
    });
};

/**
 * Check if user can edit an add for the guild
 * @param req
 * @param res
 * @param next
 */
module.exports.hasGuildAdEditPermission = function (req,res,next){
    userService.hasGuildRankPermission(req.params.region,req.params.realm,req.params.name, req.user.id,['ad', 'edit'],function(error, hasPerm) {
        if(error){
            res.status(500).send(error.message);
        } else {
            if (hasPerm)
                return next();
            res.status(403).send("ACCESS_DENIED");
        }
    });
};

/**
 * Check if the user can delete the ad for the guild
 * @param req
 * @param res
 * @param next
 */
module.exports.hasGuildAdDelPermission = function (req,res,next){
    userService.hasGuildRankPermission(req.params.region,req.params.realm,req.params.name, req.user.id,['ad', 'del'],function(error, hasPerm) {
        if(error){
            res.status(500).send(error.message);
        } else {
            if (hasPerm)
                return next();
            res.status(403).send("ACCESS_DENIED");
        }
    });
};


/**
 * Check if the user is GM
 * @param req
 * @param res
 * @param next
 */
module.exports.hasGuildGMPermission = function (req,res,next){
    userService.getGuildRank(req.params.region,req.params.realm,req.params.name, req.user.id,function(error, rank) {
        if(error){
            res.status(500).send(error.message);
        } else {
            if (rank === 0)
                return next();
            res.status(403).send("ACCESS_DENIED");
        }
    });
};
