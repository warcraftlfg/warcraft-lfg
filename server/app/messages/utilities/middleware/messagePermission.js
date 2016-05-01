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

    var objId1 = req.params.objId1 || req.body.objId1;
    var objId2 = req.params.objId2 || req.body.objId2;

    messageService.hasMessagePermission(objId1, objId2, req.user.id, function (error, hasPerm, ids, entities) {
        if (error) {
            res.status(500).send(error.message);
        } else {
            if (hasPerm) {
                req.ids = ids;
                req.entities = entities;
                return next();
            }
            res.status(403).send("ACCESS_DENIED");
        }
    });
};