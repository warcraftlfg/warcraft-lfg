"use strict";

var router = require("express").Router();
var passport = require("passport");
var userModel = process.require("users/userModel.js");

//Load express auth middleware
process.require("users/userAuth.js");

/**
 * Logout function for express
 * @param req
 * @param res
 */
function logout(req, res){
    req.logout();
    res.redirect('/');
}

/**
 * Get the user informations
 * @param req
 * @param res
 */
function getProfile(req,res){
    res.json(req.user);
}

//Define routes
router.get("/auth/bnet", passport.authenticate("bnet"));
router.get("/auth/bnet/callback", passport.authenticate("bnet", { successRedirect: "/",failureRedirect: "/" }));
router.get('/logout', logout);
router.get("/profile", getProfile);

module.exports = router;