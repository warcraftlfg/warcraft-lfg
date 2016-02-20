"use strict";
var router = require("express").Router();
var guildController = process.require("guilds/guildController.js");
var auth = process.require("users/utilities/middleware/auth.js");
var sanitize = process.require("guilds/utilities/middleware/sanitize.js");

//Define routes for all users
router.get("/guilds", guildController.getGuilds);
router.get("/guilds/count", guildController.getCount);
router.get("/guilds/:region/:realm/:name", guildController.getGuild);

//Define route for authenticated users
router.put("/guilds/ad/:region/:realm/:name", auth.isAuthenticated, sanitize.sanitize, auth.hasGuildAdEditPermission, guildController.putGuildAd);
router.delete("/guilds/ad/:region/:realm/:name", auth.isAuthenticated, sanitize.sanitize, auth.hasGuildAdDelPermission, guildController.deleteGuildAd);
router.put("/guilds/perms/:region/:realm/:name", auth.isAuthenticated, sanitize.sanitize, auth.hasGuildGMPermission, guildController.putGuildPerms);


module.exports = router;