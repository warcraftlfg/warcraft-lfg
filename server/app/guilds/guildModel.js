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
    },
    id: {
        type: Array,
        default: [0]
    }
});

/**
 * Define upsert function
 * @param query
 * @param doc
 * @param callback
 */
guildSchema.statics.upsert = function(query,doc,callback){
    return this.update(query,doc,{runValidators:true,upsert:true},callback);
};

var Guild = mongoose.model('Guild',guildSchema);

module.exports = Guild;