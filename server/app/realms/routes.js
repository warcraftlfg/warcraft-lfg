"use strict";
var router = require("express").Router();
var realmController = process.require("realms/realmController.js");

//Define routes
router.get("/realms", realmController.getRealms);

module.exports = router;