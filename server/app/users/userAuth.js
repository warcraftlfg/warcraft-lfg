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

	var redirect = config.oauth.bnet.callbackURL;
	if (config.server.html5) {
		redirect += "/redirect";
	} else {
		redirect += "/#/redirect";
	}

	return passport.authenticate("bnet", {successRedirect: redirect, failureRedirect: redirect})
};

module.exports.bnetLfgCallback = function (req, res) {
    var config = applicationStorage.config;

	var redirect = config.oauth.bnet.callbackLfgURL;
	if (config.server.html5) {
		redirect += "/redirect";
	} else {
		redirect += "/#/redirect";
	}

	return passport.authenticate("bnet-lfg", {successRedirect: redirect, failureRedirect: redirect})
};

module.exports.bnetProgressCallback = function (req, res) {
    var config = applicationStorage.config;

	var redirect = config.oauth.bnet.callbackProgressURL;
	if (config.server.html5) {
		redirect += "/redirect";
	} else {
		redirect += "/#/redirect";
	}

	return passport.authenticate("bnet-progress", {successRedirect: redirect, failureRedirect: redirect})
};

module.exports.bnetParserCallback = function (req, res) {
    var config = applicationStorage.config;

	var redirect = config.oauth.bnet.callbackParserURL;
	if (config.server.html5) {
		redirect += "/redirect";
	} else {
		redirect += "/#/redirect";
	}

	return passport.authenticate("bnet-parser", {successRedirect: redirect, failureRedirect: redirect})
};


