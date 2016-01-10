"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var userModel = process.require("users/userModel.js");
var updateModel = process.require("updates/updateModel.js");
var guildService = process.require("guilds/guildService.js");
var characterService = process.require("characters/characterService.js");

/**
 * Put the user's guilds in the update list with priority 0
 * @param id
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
                    guildService.setId(region,guild.realm,guild.name,id,function(error){
                        if(!error)
                            logger.verbose("Set id %s to guild %s-%s-%s",id,region,guild.realm,guild.name);
                        else
                            logger.error(error.message);
                        callback();
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
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;
    var self = this;
    //noinspection JSUnresolvedVariable
    async.each(config.bnetRegions,function(region,callback){
        async.waterfall([
            function(callback){
                self.getCharacters(region, id, function (error, characters) {
                    callback(error, characters);
                });
            },
            function(characters,callback){
                async.each(characters,function(character,callback){
                    characterService.setId(region,character.realm,character.name,id,function(error){
                        if(!error)
                            logger.verbose("Set id %s to character %s-%s-%s",id,region,character.realm,character.name);
                        else
                            logger.error(error.message);
                        callback();
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
 * Get the user's characters from bnet for one region
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

/**
 *
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param permAttr
 * @param callback
 */
module.exports.hasGuildRankPermission = function (region,realm,name,id,permAttr,callback) {
    var self=this;
    var getGuildPerm = function(guild,permAttr) {
        var perm = guild.perms;
        for (var i in permAttr) {
            perm = perm[permAttr[i]];
            if (!perm)
                break;
        }
        return perm || [];
    };
    self.isMember(id,region,realm,name,function(error,isMyGuild) {
        if (isMyGuild) {
            self.getGuildRank(id,region,realm,name,function(error,rank) {
                if (rank === null) {
                    // Guild not scanned yet, allow permission.
                    callback(error, true);
                } else {
                    guildService.get(region,realm,name,function(error,guild) {
                        if (!guild || !guild.perms) {
                            // Shouldn't happen if the rank call above succeeded
                            callback(error, true);
                        } else {
                            var perm = getGuildPerm(guild, permAttr);
                            callback(error, perm.indexOf(rank) !== -1);
                        }
                    });
                }
            });
        } else {
            callback(error, false);
        }
    });
};

