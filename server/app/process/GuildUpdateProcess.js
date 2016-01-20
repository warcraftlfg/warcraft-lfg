"use strict";

//Module dependencies
var applicationStorage = process.require("core/applicationStorage.js");
var updateModel = process.require("updates/updateModel.js");
var updateService = process.require("updates/updateService.js");
var guildModel = process.require("guilds/guildModel.js");
var guildService = process.require("guilds/guildService.js");
var bnetAPI = process.require("core/api/bnet.js");

var async = require("async");

function GuildUpdateProcess(){
}

GuildUpdateProcess.prototype.updateGuild = function() {
    var self = this;
    var logger = applicationStorage.logger;

    async.waterfall([
        function(callback){
            //Get next guild to update
            updateService.getNextUpdate('gu',function(error,guildUpdate){
                if(guildUpdate == null){
                    //Guild update is empty
                    logger.info("No guild to update ... waiting 3 sec");
                    setTimeout(function() {
                        callback(true);
                    }, 3000);
                } else {
                    logger.info("Update guild %s-%s-%s",guildUpdate.region,guildUpdate.realm,guildUpdate.name);
                    callback(error,guildUpdate);
                }
            });
        },
        function(guildUpdate,callback){
            //Sanitize name
            bnetAPI.getGuild(guildUpdate.region,guildUpdate.realm,guildUpdate.name,["members"],function(error,guild){
                if(error){
                    if(error.statusCode == 403){
                        logger.info("Bnet Api Deny ... waiting 1 min");
                        updateModel.insert("gu",guildUpdate.region,guildUpdate.realm,guildUpdate.name,guildUpdate.priority,function(error){
                            setTimeout(function() {
                                callback(true);
                            }, 60000);
                        });
                    } else {
                        callback(error);
                    }
                } else {
                    callback(null,guildUpdate.region,guild,guildUpdate.priority);
                }
            })
        },
        function(region,guild,priority,callback){
                async.parallel([
                    function(callback){
                        //Insert BNET
                        guildModel.upsertBnet(region,guild.realm,guild.name,guild,function(error){
                            if(error){
                                logger.error(error.message);
                            }
                            callback();
                        });
                    },
                    function(callback){
                        //Insert members to update
                        guildService.setMembersToUpdate(region,guild.realm,guild.name,guild.members,priority,function(error){
                            if(error){
                                logger.error(error.message);
                            }
                            callback();
                        });
                    },
                    function(callback){
                        //Wowprogress ranking
                        guildService.updateWowProgressKill(region,guild.realm,guild.name,function(error){
                            if(error){
                                logger.error(error.message);
                            }
                            callback();
                        });
                    },
                    function(callback){
                        //Wowprogress kills
                        guildService.updateWowProgressRanking(region,guild.realm,guild.name,function(error){
                            if(error){
                                logger.error(error.message);
                            }
                            callback();
                        });
                    }
                ],function(){
                    callback();
                });
        }
    ],function(error){
        if (error && error !==true)
            logger.error(error.message);
        self.updateGuild();
    });
};

GuildUpdateProcess.prototype.start = function(callback){
    applicationStorage.logger.info("Starting GuildUpdateProcess");
    this.updateGuild();
    callback();
};

module.exports = GuildUpdateProcess;