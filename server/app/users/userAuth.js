"use strict";

//Load dependencies
var router = require("express").Router();
var passport = require("passport");
var userController = process.require("users/userController.js");
var auth = process.require("users/utilities/middleware/auth.js");
var messagePermission = process.require("messages/utilities/middleware/messagePermission.js");
var applicationStorage = process.require("core/applicationStorage.js");

var config = applicationStorage.config;

//Load express passport bnetAuth middleware
process.require("users/utilities/middleware/bnetAuth.js");

module.exports.bnetCallback = function (req, res) {
	var config = applicationStorage.config;

	return passport.authenticate("bnet", {successRedirect: config.oauth.bnet.callbackURL, failureRedirect: config.oauth.bnet.callbackURL})
};

module.exports.bnetLfrCallback = function (req, res) {
    var config = applicationStorage.config;

	return passport.authenticate("bnet-lfg", {successRedirect: config.oauth.bnet.callbackLfgURL, failureRedirect: config.oauth.bnet.callbackLfgURL})
};

module.exports.bnetProgressCallback = function (req, res) {
    var config = applicationStorage.config;

	return passport.authenticate("bnet-progress", {successRedirect: config.oauth.bnet.callbackProgressURL, failureRedirect: config.oauth.bnet.callbackProgressURL})
};

module.exports.bnetParserCallback = function (req, res) {
    var config = applicationStorage.config;

	return passport.authenticate("bnet-progress", {successRedirect: config.oauth.bnet.callbackParserURL, failureRedirect: config.oauth.bnet.callbackParserURL})
};


