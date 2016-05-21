"use strict";
var router = require("express").Router();
var messageController = process.require("messages/messageController.js");
var auth = process.require("users/utilities/middleware/auth.js");
var messagePermission = process.require("messages/utilities/middleware/messagePermission.js");

//Define route for authenticated users
router.get("/messages/:objId1/:objId2", auth.isAuthenticated, messagePermission.hasMessagePermission, messageController.getMessages);
router.get("/messages/:objId1/:objId2/resetCount", auth.isAuthenticated, messagePermission.hasMessagePermission, messageController.resetCount);
router.get("/messages", auth.isAuthenticated, messageController.getConversations);
router.post("/messages", auth.isAuthenticated, messagePermission.hasMessagePermission, messageController.postMessage);

module.exports = router;