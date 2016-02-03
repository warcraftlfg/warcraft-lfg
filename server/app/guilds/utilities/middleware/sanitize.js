"use strict";

//Load dependencies
var bnetAPI = process.require("core/api/bnet.js");

/**
 * Sanitize guild realm and name
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.sanitize = function (req, res, next) {
    bnetAPI.getGuild(req.params.region, req.params.realm, req.params.name, [], function (error, guild) {
        if (error) {
            res.status(500).send(error.message);
        } else {
            if (guild) {
                req.params.realm = guild.realm;
                req.params.name = guild.name;
                return next();
            } else {
                res.status(404).send("GUILD_NOT_FOUND_ERROR");
            }
        }
    });
};
