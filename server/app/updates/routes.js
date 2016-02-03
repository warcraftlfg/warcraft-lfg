"use strict";

//Load dependencies
var router = require("express").Router();
var updateController = process.require("updates/updateController.js");
var auth = process.require("users/utilities/middleware/auth.js");

//Define routes
router.post('/updates', updateController.postUpdate);


module.exports = router;