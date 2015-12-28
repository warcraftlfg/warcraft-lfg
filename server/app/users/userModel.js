"use strict";

var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    battleTag:  {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    }
});

var User = mongoose.model('User',userSchema);

module.exports = User;