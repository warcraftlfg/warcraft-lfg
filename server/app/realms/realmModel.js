"use strict";

var mongoose = require("mongoose");

var realmSchema = mongoose.Schema({
    region: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    connected_realms: {
        type: [String]
    }
});

/**
 * Define upsert function
 * @param query
 * @param doc
 * @param callback
 */
realmSchema.statics.upsert = function(query,doc,callback){
    return this.update(query,doc,{runValidators:true,upsert:true},callback);
};

var Realm = mongoose.model('Realm',realmSchema);

module.exports = Realm;