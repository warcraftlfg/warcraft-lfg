"use strict";
var router = require("express").Router();
var messageController = process.require("messages/messageController.js");
var auth = process.require("users/utilities/middleware/auth.js");

//Define route for authenticated users
router.get("/messages", auth.isAuthenticated ,messageController.getMessages);
router.post("/messages", auth.isAuthenticated, messageController.postMessage);

module.exports = router;