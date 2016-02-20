"use strict";

//Load dependencies
var bnetAPI = process.require("core/api/bnet.js");

/**
 * Sanitize character realm and name with bnet API
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.sanitize = function (req, res, next) {
    bnetAPI.getCharacter(req.params.region, req.params.realm, req.params.name, [], function (error, character) {
        if (error) {
            res.status(500).send(error.message);
        } else {
            if (character) {
                req.params.realm = character.realm;
                req.params.name = character.name;
                return next();
            } else {
                res.status(404).send("CHARACTER_NOT_FOUND_ERROR");
            }
        }
    });
};
