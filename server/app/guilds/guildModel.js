"use strict";

var mongoose = require("mongoose");

var guildSchema = mongoose.Schema({
    region: {
        type: String,
        required: true
    },
    realm:  {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
    //TODO Finish guildModel
});