"use strict";

var router = require("express").Router();
var passport = require("passport");
var userModel = process.require("users/userModel.js");

//Define middleware
process.require("users/userAuth.js");

function logout(req, res){
    req.logout();
    res.redirect('/');
}

function getUser(req,res){
    res.json(req.user);
}

router.get("/auth/bnet", passport.authenticate("bnet"));
router.get("/auth/bnet/callback", passport.authenticate("bnet", { successRedirect: "/",failureRedirect: "/" }));
router.get('/logout', logout);

router.get("/user", getUser);

module.exports = router;