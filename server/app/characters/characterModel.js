"use strict";

var mongoose = require("mongoose");

var characterSchema = mongoose.Schema({
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
        type: Number,
        default: 0
    }
});

/**
 * Define upsert function
 * @param query
 * @param doc
 * @param callback
 */
characterSchema.statics.upsert = function(query,doc,callback){
    return this.update(query,doc,{runValidators:true,upsert:true},callback);
};

var Character = mongoose.model('Character',characterSchema);

module.exports = Character;