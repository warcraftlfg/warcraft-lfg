"use strict";
var router = require("express").Router();
var messageController = process.require("messages/messageController.js");
var auth = process.require("users/utilities/middleware/auth.js");

//Define route for authenticated users
router.get("/messages/:id/:type/:region/:realm/:name", auth.isAuthenticated ,messageController.getMessages);
router.get("/messages", auth.isAuthenticated, messageController.getMessagesList);
router.post("/messages", auth.isAuthenticated, messageController.postMessage);

module.exports = router;