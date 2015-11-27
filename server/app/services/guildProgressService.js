"use strict";
var logger = process.require("api/logger.js").get("logger");
var guildProgressUpdateModel = process.require("models/guildProgressUpdateModel.js");
var guildModel = process.require("models/guildModel.js");

var async = require("async");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');

module.exports.updateNext = function(callback){
    var self=this;
    guildProgressUpdateModel.getNextToUpdate(function(error,guildProgressUpdate) {
        if (error) {
            logger.error(error.message);
            return callback(error);
        }
        if (guildProgressUpdate) {
            //Get Guild Update Result (json or key)
            if(guildProgressUpdate.region && guildProgressUpdate.realm && guildProgressUpdate.name) {
                logger.info("Update GuildProgress "+guildProgressUpdate.region+"-"+guildProgressUpdate.realm+"-"+guildProgressUpdate.name);
                self.update(guildProgressUpdate.region, guildProgressUpdate.realm, guildProgressUpdate.name, function (error) {
                    callback(error);
                });
            }
            else{
                //Guild Progress Update is already parse before
                callback();
            }
        }
        else{
            //Guild Update is empty
            logger.info("No guildProgressUpdate ... waiting 3 sec");
            setTimeout(function() {
                callback();
            }, 3000);
        }
    });
};
module.exports.update = function(region,realm,name,callback) {
    async.eachSeries(config.progress,function(raid,callback){
        guildModel.computeProgress(region,realm,name,raid,function(error,result){
            if (error)
                return callback(error);
            var progress = {};
            async.forEachSeries(result,function(obj,callback){
                progress[obj._id] = obj.value;
                progress[obj._id+"Count"] = Object.keys(obj.value).length;
                callback();
            },function() {

                guildModel.insertOrUpdateProgress(region, realm, name, progress, function (error, result) {
                    callback();
                });
            });
        });
    },function(){
        callback();
    });
};

