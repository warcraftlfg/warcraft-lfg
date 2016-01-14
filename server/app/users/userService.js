"use strict";

//Load dependencies
var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");
var userModel = process.require("users/userModel.js");
var updateModel = process.require("updates/updateModel.js");
var guildModel = process.require("guilds/guildModel.js");
var guildService = process.require("guilds/guildService.js");
var characterModel = process.require("characters/characterModel.js");
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
    async.each(config.bnetRegions,function(region,callback){
        async.waterfall([
            function(callback){
                //Get user guilds from Bnet
                self.getGuilds(region, id, function (error, guilds) {
                    callback(error, guilds);
                });
            },
            function(guilds,callback){
                // Set the ID for each bnet guilds
                var bnetGuilds = [];
                async.each(guilds,function(guild,callback){
                    guildService.sanitizeAndSetId(region,guild.realm,guild.name,id,function(error,guild){
                        bnetGuilds.push(guild);
                        if(!error)
                            logger.verbose("Set id %s to guild %s-%s-%s",id,region,guild.realm,guild.name);
                        else
                            logger.error(error.message);
                        callback();
                    });
                },function(error){
                    callback(error,bnetGuilds);
                });
            },
            function(bnetGuilds,callback) {
                //Clean guild ID if people have leave a guild
                guildModel.find({region:region,id:id},{realm:1,name:1},function(error,guilds){
                    async.each(guilds,function(guild,callback){
                        var isOk = false;
                        async.each(bnetGuilds,function(bnetGuild,callback){
                            if(bnetGuild.realm === guild.realm &&  bnetGuild.name === guild.name)
                                isOk = true;
                            callback();
                        },function(){
                            if(isOk == false ) {
                                guildModel.removeId(region, guild.realm, guild.name, id,function(error){
                                    logger.verbose("Remove id %s to guild %s-%s-%s",id,region,guild.realm,guild.name);
                                    callback(error);
                                });
                            }
                        });
                    },function(error){
                        callback(error);
                    });
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
                    characterService.sanitizeAndSetId(region,character.realm,character.name,id,function(error){
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
            userModel.findById(id,function(error,user){
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

    async.waterfall([
        function(callback){
            self.isMember(region,realm,name,id,function(error,isMyGuild) {
                callback(error,isMyGuild);
            });
        },
        function(isMyGuild,callback){
            if (isMyGuild) {
                self.getGuildRank(region,realm,name,id,function(error,rank) {
                    if (rank === null) {
                        // Guild not scanned yet, allow permission.
                        callback(error, true);
                    } else {
                        guildModel.findOne({region:region,realm:realm,name:name},{perms:1},function(error,guild) {
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
                callback(null, false);
            }
        }
    ],function(error,hasPerm){
        callback(error,hasPerm);
    });
};

/**
 *
 * @param id
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.getGuildRank = function (region,realm,name,id,callback){
    var logger = applicationStorage.logger;
    var self=this;
    //Do not check if owner when id = 0
    if(id==0){
        callback(null,0);
        return;
    }

    async.waterfall([
        function(callback){
            guildModel.findOne({region:region,realm:realm,name:name},{bnet:1},function(error,guild) {
                callback(error,guild);
            });
        },
        function(guild,callback){
            var lowestRankNum = null;
            if (guild && guild.bnet) {
                async.each(guild.bnet.members,function(member,callback) {
                    self.isOwner(member.character.region,member.character.realm,member.character.name,id, function (error, isOwnCharacter) {
                        if (isOwnCharacter && (lowestRankNum === null || member.rank < lowestRankNum)) {
                            lowestRankNum = member.rank;
                        }
                        callback(error);
                    });
                }, function (error) {
                    if(error)
                        logger.error(error.message);
                    callback(null, lowestRankNum);
                });
            } else {
                callback(null, lowestRankNum);
            }
        }
    ],function(error,lowestRankNum){
        callback(error,lowestRankNum);
    });
};

/**
 * Return if user is member of a guild
 * @param id
 * @param region
 * @param realm
 * @param name
 * @param callback
 * @returns {*}
 */
module.exports.isMember = function (region,realm,name,id,callback){

    guildModel.findOne({region:region,realm:realm,name:name,id:id},{id:1},function(error, guild){
        if(guild)
            callback(error,true);
        else
            callback(error,false);
    });
};

/**
 * Return if user is owner of the character
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.isOwner = function(region,realm,name,id,callback) {
    characterModel.findOne({region:region,realm:realm,name:name,id:id},{id:1},function(error,character) {
        if(character)
            callback(error,true);
        else
            callback(error,false);
    });
};