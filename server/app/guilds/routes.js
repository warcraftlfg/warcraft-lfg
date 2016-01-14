"use strict";
var router = require("express").Router();
var guildController = process.require("guilds/guildController.js");
var auth = process.require("users/utilities/middleware/auth.js");

//Define routes for all users
router.get("/guilds", guildController.getGuilds);
router.get("/guilds/:region/:realm/:name", guildController.getGuild);

//Define route for authenticated users
router.put("/guilds/ad/:region/:realm/:name",auth.isAuthenticated, guildController.putGuildAd);
router.delete("/guilds/ad/:region/:realm/:name",auth.isAuthenticated, guildController.deleteGuildAd);
router.put("/guilds/perms/:region/:realm/:name",auth.isAuthenticated, guildController.putGuildPerms);


module.exports = router;