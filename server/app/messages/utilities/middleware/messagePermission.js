"use strict";

var messageService = process.require("messages/messageService.js");

/**
 * Check if user has permission to do something with message
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.hasMessagePermission = function (req, res, next) {

    messageService.hasMessagePermission(req.body.region, req.body.realm, req.body.name, req.body.type, req.body.creatorId, req.user.id, function (error, hasPerm) {

        if (error) {
            res.status(500).send(error.message);
        } else {
            if (hasPerm) {
                return next();
            }
            res.status(403).send("ACCESS_DENIED");
        }
    });
};