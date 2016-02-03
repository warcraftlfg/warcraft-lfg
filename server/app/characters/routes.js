"use strict";

//Load dependencies
var router = require("express").Router();
var characterController = process.require("characters/characterController.js");
var auth = process.require("users/utilities/middleware/auth.js");
var sanitize = process.require("characters/utilities/middleware/sanitize.js");

//Define routes for all users
router.get("/characters", characterController.getCharacters);
router.get("/characters/:region/:realm/:name", characterController.getCharacter);

//Define route for authenticated users
router.put("/characters/ad/:region/:realm/:name", auth.isAuthenticated, sanitize.sanitize, auth.isOwner, characterController.putCharacterAd);
router.delete("/characters/ad/:region/:realm/:name", auth.isAuthenticated, sanitize.sanitize, auth.isOwner, characterController.deleteCharacterAd);

module.exports = router;