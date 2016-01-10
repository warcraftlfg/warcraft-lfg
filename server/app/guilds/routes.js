"use strict";
var router = require("express").Router();
var guildController = process.require("guilds/guildController.js");

//Define routes
router.get("/guilds", guildController.getGuilds);
router.get("/guilds/:region/:realm/:name", guildController.getGuild);
router.put("/guilds/:region/:realm/:name", guildController.putGuild);

module.exports = router;