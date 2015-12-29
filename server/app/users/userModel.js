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


/**
 * Define upsert function
 * @param query
 * @param doc
 * @param callback
 */
userSchema.statics.upsert = function(query,doc,callback){
    return this.update(query,doc,{runValidators:true,upsert:true},callback);
};

var User = mongoose.model('User',userSchema);

module.exports = User;