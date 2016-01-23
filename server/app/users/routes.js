"use strict";

//Load dependencies
var router = require("express").Router();
var passport = require("passport");
var userController = process.require("users/userController.js");
var auth = process.require("users/utilities/middleware/auth.js");


//Load express passport bnetAuth middleware
process.require("users/utilities/middleware/bnetAuth.js");

//Define routes
router.get("/auth/bnet", passport.authenticate("bnet"));
router.get("/auth/bnet/callback", passport.authenticate("bnet", {successRedirect: "/", failureRedirect: "/"}));
router.get('/user/logout', auth.isAuthenticated, userController.logout);
router.get("/user/profile", auth.isAuthenticated, userController.getProfile);
router.get("/user/characterAds", auth.isAuthenticated, userController.getCharacterAds);
router.get("/user/guildAds", auth.isAuthenticated, userController.getGuildAds);
router.get("/user/characters/:region", auth.isAuthenticated, userController.getCharacters);
router.get("/user/guilds/:region", auth.isAuthenticated, userController.getGuilds);
router.get("/user/guildRank/:region/:realm/:name", auth.isAuthenticated, userController.getGuildRank);

module.exports = router;

