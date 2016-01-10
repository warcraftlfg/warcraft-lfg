"use strict";

//Load dependencies
var router = require("express").Router();
var passport = require("passport");
var userController = process.require("users/userController.js");

//Load express passport bnetAuth middleware
process.require("users/utilities/middleware/bnetAuth.js");

//Define routes
router.get("/auth/bnet", passport.authenticate("bnet"));
router.get("/auth/bnet/callback", passport.authenticate("bnet", { successRedirect: "/",failureRedirect: "/" }));
router.get('/user/logout', userController.logout);
router.get("/user/profile", userController.getProfile);
router.get("/user/characterAds", userController.getCharacterAds);
router.get("/user/guildAds",userController.getGuildAds);
router.get("/user/characters/:region",userController.getCharacters);
router.get("/user/guilds/:region",userController.getGuilds);

module.exports = router;

