"use strict"

//Defines dependencies
var guildSchema = process.require('config/db/guildSchema.json');
var applicationStorage = process.require("api/applicationStorage");
var Confine = require("confine");

//Configuration
var confine = new Confine();

/**
 * Defines a model class to manipulate guilds
 * @constructor
 */
function GuildModel(data){
    this.data = this.sanitize(data);
    this.database = applicationStorage.getDatabase();
}

GuildModel.prototype.data = {};

GuildModel.prototype.get = function(name){
    return this.data[name];
};

GuildModel.prototype.sanitize = function(data){
    return confine.normalize(data,guildSchema);
};

GuildModel.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);

    //Check for required attributes
    if(this.data.region == null){
        callback(new Error('Field region is required in GuildModel'));
        return;
    }
    if(this.data.realm == null){
        callback(new Error('Field realm is required in GuildModel'));
        return;
    }
    if(this.data.name == null){
        callback(new Error('Field name is required in GuildModel'));
        return;
    }

    //Create or update guild
    this.database.insertOrUpdate("guilds",{region:self.data.region,realm:self.data.realm,name:self.data.name},self.data, function(error){
        callback(error, self);
    });
};

module.exports = GuildModel;


