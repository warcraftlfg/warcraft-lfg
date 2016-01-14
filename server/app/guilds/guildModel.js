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
 * @param callback
 */
module.exports.find = function(criteria,projection,sort,limit,callback){
    var collection = applicationStorage.mongo.collection("guilds");
    if(limit === undefined && callback == undefined) {
        callback = sort;
        collection.find(criteria, projection).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else if(callback == undefined) {
        callback = limit;
        collection.find(criteria, projection).sort(sort).toArray(function (error, characters) {
            callback(error, characters);
        });
    } else {
        collection.find(criteria, projection).sort(sort).limit(limit).toArray(function (error, guilds) {
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
            ad.updated = new Date().getTime();
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.update({region:region,realm:realm,name:name}, {$set:{ad:ad}}, {upsert:true}, function(error){
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
            perms.updated = new Date().getTime();
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.update({region:region,realm:realm,name:name}, {$set:{perms:perms}}, {upsert:true}, function(error){
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
            bnet.updated = new Date().getTime();
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.update({region:region,realm:realm,name:name}, {$set:{bnet:bnet}}, {upsert:true}, function(error){
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
            wowProgress.updated = new Date().getTime();
            //Upsert
            var collection = applicationStorage.mongo.collection("guilds");
            collection.update({region:region,realm:realm,name:name}, {$set:{wowProgress:wowProgress}}, {upsert:true}, function(error){
                callback(error);
            });
        }
    ],function(error){
        callback(error);
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
            collection.update({region:region,realm:realm,name:name}, {$unset: {ad:""}}, function(error){
                callback(error);
            });
        }
    ],function(error){
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
            collection.update({region:region,realm:realm,name:name}, {$addToSet:{id:id}}, {upsert:true}, function(error){
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
            collection.update({region: region, realm: realm, name: name}, {$pull: {id: id}}, function (error) {
                callback(error);
            });
        }
    ],function(error){
        callback(error);
    });
};


