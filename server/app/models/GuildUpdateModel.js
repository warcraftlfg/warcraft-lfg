"use strict"

//Defines dependencies
var schemas = process.require('config/db/db.schemas.json');
var _ = require("lodash");
var applicationStorage = process.require("api/applicationStorage");

/**
 * Defines a model class to manipulate guild updates
 * @constructor
 */
function GuildUpdateModel(data){

    this.data = this.sanitize(data);
    this.database = applicationStorage.getDatabase();
}

GuildUpdateModel.prototype.data = {}

GuildUpdateModel.prototype.get = function(name){
    return this.data[name];
};

GuildUpdateModel.prototype.sanitize = function(data){
    var data = data || {};
    var schema = schemas.guildUpdate;
    return _.pick(_.defaults(data, schema), _.keys(schema));
};

GuildUpdateModel.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);

    //Check for required attributes
    if(this.data.region == null){
        callback(new Error('Field region is required in GuildUpdateModel'));
        return;
    }
    if(this.data.realm == null){
        callback(new Error('Field realm is required in GuildUpdateModel'));
        return;
    }
    if(this.data.name == null){
        callback(new Error('Field name is required in GuildUpdateModel'))
        return;
    }

    //Create or update guildUpdate
    this.database.insertOrUpdate("guild-updates",{region:self.data.region,realm:self.data.realm,name:self.data.name},self.data, function(error){
        callback(error, self);
    });
};
GuildUpdateModel.prototype.delete = function (callback) {
    var self=this;
    this.database.remove("guild-updates",self.data,function(error){
        self.data = null;
        callback(error);
    });
}

GuildUpdateModel.getOlder = function (callback){
    var database = applicationStorage.getDatabase();
    database.search("guild-updates", {}, {}, 1, 1, {_id:1}, function(error,data){
        if(error) {
            callback(error);
            return;
        }
        if(data.length == 0 ) {
            callback (null,null);
            return;
        }

        callback(null, new GuildUpdateModel(data[0]));
    });
};

module.exports = GuildUpdateModel;


