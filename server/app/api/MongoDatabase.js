"use strict";

/**
 * @module api-mongodb
 */

// Module dependencies
var util = require("util");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

// Configuration
var logger = process.require("api/logger.js").get("logger");


function MongoDatabase(databaseConf){
    this.conf = databaseConf;
}

module.exports = MongoDatabase;

MongoDatabase.prototype.connect = function(callback){
    var self = this;
    var connectionUrl = "mongodb://" + this.conf.username + ":" + this.conf.password + "@" + this.conf.host + ":" + this.conf.port;
    var database = "/" + this.conf.database;
    var seedlist = "," + this.conf.seedlist;
    var replicaset = "?replicaSet="+ this.conf.replicaSet+"&readPreference=secondary";

    //Connect to a Replica Set or not
    if(this.conf.seedlist != undefined
        && this.conf.seedlist != ''
        && this.conf.replicaSet != undefined
        && this.conf.replicaSet != ''){
        connectionUrl = connectionUrl + seedlist + database + replicaset;
    } else  connectionUrl = connectionUrl + database;

    MongoClient.connect(connectionUrl, function(error, db){
        // Connection failed
        if(error){
            logger.error(error.message);
            callback(new Error("DATABASE_ERROR"));
        }

        // Connection succeeded
        else{
            self.db = db;
            callback();
        }
    });

};

MongoDatabase.prototype.insert = function(collection, data, callback){
    var collection = this.db.collection(collection);
    collection.insert(data, function(error,result){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
        }
        callback(error,result);
    });
};


MongoDatabase.prototype.remove = function(collection, criteria, callback){
    var collection = this.db.collection(collection);
    collection.remove(criteria, function(error,result){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
        }
        callback(error,result);
    });

};


MongoDatabase.prototype.insertOrUpdate = function(collection, criteria, document, data, callback){
    var collection = this.db.collection(collection);
    var document = document || {$set : data}
    collection.update(criteria, document, {upsert:true, multi:true}, function(error,result){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
        }
        callback(error,result);
    });
};




MongoDatabase.prototype.get = function(collection, criteria, projection, limit, callback){
    var collection = this.db.collection(collection);

    var criteria = criteria || {};
    var projection = projection || {};
    var limit = limit || -1;

    if(limit === -1)
        collection.find(criteria, projection).toArray(function(error,result){
            if(error){
                logger.error(error.message);
                error = new Error("DATABASE_ERROR");
            }
            callback(error,result);
        });
    else
        collection.find(criteria, projection).limit(limit).toArray(function (error,result){
            if(error){
                logger.error(error.message);
                error = new Error("DATABASE_ERROR");
            }
            callback(error,result);
        });
};

MongoDatabase.prototype.search = function(collection, criteria, projection, limit, page, sort, callback){

    var collection = this.db.collection(collection);

    var criteria = criteria || {};
    var projection = projection || {};
    var limit = limit || -1;
    var skip = limit * (page - 1) || 0;
    var sort = sort || {};

    if(limit === -1)
        collection.find(criteria, projection).sort(sort).toArray(function(error,result){
            if(error){
                logger.error(error.message);
                error = new Error("DATABASE_ERROR");
            }
            callback(error,result);
        });
    else{
        var cursor = collection.find(criteria, projection).sort(sort).skip(skip).limit(limit);
        var rows = cursor.toArray(function (err, res) {
            cursor.count(false, null,function (err, count) {
                var paginate = {
                    "count": limit,
                    "page": page,
                    "pages": Math.ceil(count / limit),
                    "size": count
                };
                if(err){
                    logger.error(err.message);
                    err = new Error("DATABASE_ERROR");
                }
                callback(err, res, paginate)
            });
        });
    }
};

MongoDatabase.prototype.count = function (collection,criteria, callback){
    var collection = this.db.collection(collection);

    var criteria = criteria || {};
    collection.count(criteria,function(err,count){
        if(err){
            logger.error(err.message);
            err = new Error("DATABASE_ERROR");
        }
        callback(err, count);
    });
};

