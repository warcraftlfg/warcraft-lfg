"use strict";

//Define dependencies
var userModel = process.require("models/userModel.js");
var guildUpdateModel = process.require("models/guildUpdateModel.js");
var characterService = process.require("services/characterService.js");
var guildService = process.require("services/guildService.js");

var async = require("async");
var bnetAPI = process.require("api/bnet.js");

//Configuration
var env = process.env.NODE_ENV || 'dev';
var config = process.require('config/config.'+env+'.json');
var logger = process.require("api/logger.js").get("logger");


module.exports.getGuilds = function(region,id,callback){
    var self=this;
    async.waterfall([
        function(callback){
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
    ],function(error,guildArray){
        callback(error,guildArray);
    });
};

module.exports.getCharacters = function(region,id,callback){
    userModel.findById(id,function(error,user){
        if (error) {
            callback(error);
        }
        bnetAPI.getUserCharacters(region,user.accessToken,function(error,characters){
            if (error) {
                callback(error);
                return;
            }
            var result = [];
            characters.forEach(function(character){
                //if(character.level >= 100)
                result.push(character);
            });
            callback(null,result);
        });
    });
};

module.exports.getGuildRank = function (id,region,realm,name,callback){
    var self=this;
    //Do not check when id = 0
    if(id==0){
        callback(null,0);
        return;
    }

    function isOwner(character, callback) {
        characterService.get(region,character.realm,character.name,function(error,character) {
            if (error)
                callback(error, null);
            callback(null, character && character.id === id);
        });
    }

    async.waterfall([
        function(callback){
            guildService.get(region,realm,name,function(error,guild) {
                callback(error,guild);
            });
        },
        function(guild,callback){
            var lowestRankNum = null;
            if (guild && guild.bnet) {
                async.each(guild.bnet.members,function(member,callback) {
                    isOwner(member.character, function (error, isOwnCharacter) {
                        if (isOwnCharacter && (lowestRankNum === null || member.rank < lowestRankNum)) {
                            lowestRankNum = member.rank;
                        }
                        callback(error);
                    });
                }, function (error) {
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

module.exports.hasGuildRankPermission = function (id,region,realm,name,permAttr,callback) {
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

module.exports.importGuilds = function(id){
    var self=this;
    //noinspection JSUnresolvedVariable
    config.bnet_regions.forEach(function(region) {
        self.getGuilds(region,id,function(error,guilds) {
            if(error) {
                logger.error(error.message);
                return;
            }
            guilds.forEach(function (guild) {
                guildUpdateModel.insertOrUpdate(region, guild.realm, guild.name,0,function(){
                    logger.info("Insert guild  to update "+ region+"-"+guild.realm+"-"+guild.name);
                });
            });

        });
    });
};

module.exports.updateCharactersId = function(id){
    var self = this;
    //noinspection JSUnresolvedVariable
    config.bnet_regions.forEach(function(region) {
        self.getCharacters(region,id,function(error,characters){
            if (error){
                logger.error(error);
                return;
            }
            characters.forEach(function (character){
                characterService.setId(region,character.realm,character.name,id,function(error){
                    if (error)
                        logger.error(error.message);
                });
            });
        });
    });
};

module.exports.updateGuildsId = function(id){
    var self = this;
    //noinspection JSUnresolvedVariable
    config.bnet_regions.forEach(function(region) {
        self.getGuilds(region,id,function(error,guilds){
            if (error){
                logger.error(error);
                return;
            }
            guilds.forEach(function (guild){
                guildService.setId(region,guild.realm,guild.name,id,function(error){
                    if (error)
                        logger.error(error.message);
                });
            });
        });
    });
};

module.exports.isOwner = function (id,region,realm,name,callback){
    //Do not check if owner when id = 0
    if(id==0){
        callback(null,true);
        return;
    }
    this.getCharacters(region,id,function (error,characters) {
        if (error) {
            callback(error);
            return;
        }
        var isMyCharacter = false;
        async.forEach(characters, function (character, callback) {
            if (character.name == name && character.realm == realm)
                isMyCharacter = true;
            callback();
        });
        callback(error,isMyCharacter);
    });
};

module.exports.isMember = function (id,region,realm,name,callback){
    //Do not check if owner when id = 0
    if(id==0){
        callback(null,true);
        return;
    }
    this.getGuilds(region, id, function(error,guilds){
        if (error){
            callback(error);
            return;
        }
        var isMyCharacter = false;
        async.forEach(guilds, function (guild, callback) {
            if (guild.name == name && guild.realm == realm)
                isMyCharacter = true;
            callback();
        });
        callback(error,isMyCharacter);
    });
};
