"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("api/applicationStorage.js");
var bnetAPI = process.require("api/bnet.js");
var userModel = process.require("users/userModel.js");
var updateModel = process.require("updates/updateModel.js");
var guildService = process.require("guilds/guildService.js");

/**
 * Put the user's guilds in the update list with priority 0
 * @param id
 * @param callback
 */
module.exports.setGuildsToUpdate = function(id){
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var self=this;

    //noinspection JSUnresolvedVariable
    async.each(config.bnetRegions,function(region,callback){
        async.waterfall([
            function(callback){
                self.getGuilds(region,id,function(error,guilds){
                    callback(error,guilds);
                });
            },
            function(guilds,callback){
                async.each(guilds,function(guild,callback){
                    updateModel.upsert('gu',region,guild.realm,guild.name,0,function(error){
                        logger.verbose("Set guild %s-%s-%s to update with priority %s",region,guild.realm,guild.name,0);
                        callback(error);
                    });
                },function(error){
                    callback(error)
                });
            }
        ],function(error){
            if(error)
                logger.error(error.message);
            callback();
        });
    });
};

/**
 * Set battlenet id on user's guild
 * @param id
 * @param callback
 */
module.exports.updateGuildsId = function(id){
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var self = this;
    //noinspection JSUnresolvedVariable

    async.each(config.bnetRegions,function(region,callback){
        async.waterfall([
            function(callback){
                self.getGuilds(region, id, function (error, guilds) {
                    callback(error, guilds);
                });
            },
            function(guilds,callback){
                async.each(guilds,function(guild,callback){
                    guildService.setId(guild.region,guild.realm,guild.name,id,function(error){
                        logger.verbose("Set id %s to guild %s-%s-%s",id,region,guild.realm,guild.name);
                        callback(error);
                    });
                },function(error){
                    callback(error);
                });
            }
        ],function(error){
            if(error)
                logger.error(error.message);
            callback();
        });
    });
};

/**
 * Set battlenet id on user's character
 * @param id
 */
module.exports.updateCharactersId = function(id){

};

/**
 * Get the user's guilds from bnet
 * @param region
 * @param id
 * @param callback
 */
module.exports.getGuilds = function(region,id,callback){
    var self=this;
    async.waterfall([
        function(callback){
            //get user's characters
            self.getCharacters(region,id,function(error,characters) {
                callback(error,characters);
            });
        },
        function(characters,callback){
            var guilds = {};
            //Fetch all characters and keep guild
            async.each(characters,function(/*{guild,guildRealm}*/character,callback){
                if(character.guild)
                    guilds[character.guild+character.guildRealm] = {name: character.guild, realm: character.guildRealm, region: region};
                callback();
            },function(error){
                //Remove Key
                var guildArray = Object.keys(guilds).map(function (key) {return guilds[key]});
                callback(error,guildArray);
            });
        }
    ],function(error,guilds){
        callback(error,guilds);
    });
};

/**
 * Get the user's characters from bnet
 * @param region
 * @param id
 * @param callback
 */
module.exports.getCharacters = function(region,id,callback){
    async.waterfall([
        function(callback){
            userModel.findOne({id:id},function(error,user){
                callback(error,user);
            });
        },
        function(user,callback){
            bnetAPI.getUserCharacters(region,user.accessToken,function(error,characters) {
                callback(error,characters)
            });
        }
    ],function(error,characters){
        callback(error,characters);
    });
};