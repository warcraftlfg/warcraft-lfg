"use strict";

//Load dependencies
var router = require("express").Router();
var characterController = process.require("characters/characterController.js");

//Define routes
router.get("/characters", characterController.getCharacters);
router.get("/characters/:region/:realm/:name", characterController.getCharacter);
router.put("/characters/:region/:realm/:name", characterController.putCharacter);

module.exports = router;