"use strict";

var async = require("async");
var applicationStorage = process.require("core/applicationStorage.js");
var guildAdSchema = process.require('config/db/guildAdSchema.json');
var guildPermsSchema = process.require('config/db/guildPermsSchema.json');
var validator = process.require('core/utilities/validators/validator.js');
var Confine = require("confine");

/**
 * Get the guilds
 * @param criteria
 * @param projection
 * @param sort
 * @param limit
 * @param hint
 * @param callback
 */
module.exports.find = function(criteria,projection,sort,limit,hint,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    if(hint === undefined && limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    } else if(hint === undefined && callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    } else if(callback == undefined) {
        callback = hint;
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).hint(hint).toArray(function (error, guilds) {
            callback(error, guilds);
        });
    }
};

/**
 * Get one guild
 * @param criteria
 * @param projection
 */
module.exports.findOne = function(criteria,projection,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    collection.findOne(criteria, projection,function (error, guild) {

        //Sanitize before return
        if(guild) {
            var confine = new Confine();
            guild.ad = confine.normalize(guild.ad, guildAdSchema);
            guild.perms = confine.normalize(guild.perms, guildPermsSchema);
        }
        callback(error, guild);
    });
};

/**
 * Return the number of guilds
 * @param criteria
 * @param callback
 */
module.exports.count = function(criteria,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    collection.count(criteria,function(error,count){
        callback(error, count);
    });
};

/**
 * Update or insert ad for the guild
 * @param region
 * @param realm
 * @param name
 * @param ad
 * @param callback
 */
module.exports.upsertAd = function(region,realm,name,ad,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            //Sanitize ad object
            var confine = new Confine();
            ad = confine.normalize(ad,guildAdSchema);
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            var date = new Date().getTime();
            var guild = {};
            guild.region = region;
            guild.realm = realm;
            guild.name = name;
            guild.updated = date;
            ad.updated = date;
            guild.ad = ad;
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$set:guild}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Update or insert perms for the guild
 * @param region
 * @param realm
 * @param name
 * @param perms
 * @param callback
 */
module.exports.upsertPerms = function(region,realm,name,perms,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            //Sanitize ad object
            var confine = new Confine();
            perms = confine.normalize(perms,guildPermsSchema);
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            var date = new Date().getTime();
            var guild = {};
            guild.region = region;
            guild.realm = realm;
            guild.name = name;
            guild.updated = date;
            perms.updated = date;
            guild.perms = perms;
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$set:guild}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Update or insert bnet object for the guild
 * @param region
 * @param realm
 * @param name
 * @param perms
 * @param callback
 */
module.exports.upsertBnet = function(region,realm,name,bnet,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            var date = new Date().getTime();
            var guild = {};
            guild.region = region;
            guild.realm = realm;
            guild.name = name;
            guild.updated = date;
            bnet.updated = date;
            guild.bnet = bnet;
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$set:guild}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};


/**
 * Update or insert wowprogress object for the guild
 * @param region
 * @param realm
 * @param name
 * @param wowProgress
 * @param callback
 */
module.exports.upsertWowProgress = function(region,realm,name,wowProgress,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            var date = new Date().getTime();
            var guild = {};
            guild.region = region;
            guild.realm = realm;
            guild.name = name;
            guild.updated = date;
            wowProgress.updated = date;
            guild.wowProgress = wowProgress;
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$set:guild}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * Update or insert progress object for the guild
 * @param region
 * @param realm
 * @param name
 * @param progress
 * @param callback
 */
module.exports.upsertProgress = function(region,realm,name,raid,progress,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            //Upsert
            var date = new Date().getTime();
            var guild = {};
            guild.region = region;
            guild.realm = realm;
            guild.name = name;
            guild.updated = date;
            var obj = {};
            progress.updated = date;
            obj[raid] = progress;
            guild.progress = obj;
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$set:guild}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};


/**
 * Delete Ad for the guild
 * @param region
 * @param realm
 * @param name
 * @param callback
 */
module.exports.deleteAd = function(region,realm,name,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name},function(error){
                callback(error);
            });
        },
        function(callback){
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$unset: {ad:""}}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 * set lfg to false for ads of 3 month old
 * @param callback
 */
module.exports.disableLfgForOldAds = function(callback){
    var timestamp = new Date().getTime() - (120 * 24 * 3600 * 1000);
    var collection = applicationStorage.mongo.collection("guilds");
    collection.updateMany({"ad.updated":{$lte:timestamp},"ad.lfg":true},{$set: {"ad.lfg":false}}, function(error){
        callback(error);
    });
};

/**
 * AddtoSet ID
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.setId = function(region,realm,name,id,callback){
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name,id:id},function(error){
                callback(error);
            });
        },
        function(callback){
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region:region,realm:realm,name:name}, {$addToSet:{id:id}}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};

/**
 *
 * @param region
 * @param realm
 * @param name
 * @param id
 * @param callback
 */
module.exports.removeId = function(region,realm,name,id, callback) {
    async.series([
        function(callback){
            //Format value
            region = region.toLowerCase();
            callback();
        },
        function(callback){
            //Validate Params
            validator.validate({region:region,realm:realm,name:name,id:id},function(error){
                callback(error);
            });
        },
        function(callback){
            var collection = applicationStorage.mongo.collection("guilds");
            collection.updateOne({region: region, realm: realm, name: name}, {$pull: {id: id}}, function (error) {
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};


