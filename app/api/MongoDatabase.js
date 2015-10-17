"use strict";

/**
 * @module api-mongodb
 */

// Module dependencies
var util = require("util");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

// Configuration
var logger = process.require("app/api/logger.js").get("logger");

/**
 * Defines a MongoDB Database.
 *
 * @example
 *     var databaseConf = {
 *       "type" : "mongodb",
 *       "host" : "localhost",
 *       "port" : 27017,
 *       "database" : "[database-name]",
 *       "username" : "[database-username]",
 *       "password" : "[database-password]"
 *     };
 *
 * @class MongoDatabase
 * @constructor
 * @param databaseConf A database configuration object like
 */
function MongoDatabase(databaseConf){
    this.conf = databaseConf;
}

module.exports = MongoDatabase;

/**
 * Establishes connection to the database.
 *
 * @method connect
 * @async
 * @param {Function} callback The function to call when connection
 * to the database is done
 *   - **Error** The error if an error occurred, null otherwise
 */
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

/**
 * Inserts a document into a collection.
 *
 * @method insert
 * @async
 * @param collection The collection to work on
 * @param data The array of documents to insert into the collection
 * @param callback The function to call when it's done
 *   - **Error** The error if an error occurred, null otherwise
 */
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

/**
 * Removes a document from a collection.
 *
 * @method remove
 * @async
 * @param {String} collection The collection to work on
 * @param {Object} criteria The remove criteria
 * @param {Function} callback The function to call when it's done
 *   - **Error** The error if an error occurred, null otherwise
 */
MongoDatabase.prototype.remove = function(collection, criteria, callback){
    if(criteria && Object.keys(criteria).length){
        var collection = this.db.collection(collection);
        collection.remove(criteria, function(error,result){
            if(error){
                logger.error(error.message);
                error = new Error("DATABASE_ERROR");
            }
            callback(error,result);
        });
    }
};

/**
 * Updates a document.
 *
 * @method update
 * @async
 * @param {String} collection The collection to work on
 * @param {Object} criteria The update criteria
 * @param {Object} data Data to update
 * @param {Function} callback The function to call when it's done
 *   - **Error** The error if an error occurred, null otherwise
 */
MongoDatabase.prototype.update = function(collection, criteria, data, callback){
    var collection = this.db.collection(collection);
    collection.update(criteria, {$set : data}, {multi:true}, function(error,result){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
        }
        callback(error,result);
    });
};

/**
 * Insert or update a document.
 *
 * @method update
 * @async
 * @param {String} collection The collection to work on
 * @param {Object} criteria The update criteria
 * @param {Object} data Data to update
 * @param {Function} callback The function to call when it's done
 *   - **Error** The error if an error occurred, null otherwise
 */
MongoDatabase.prototype.InsertOrUpdate = function(collection, criteria, data, callback){
    var collection = this.db.collection(collection);
    collection.update(criteria, {$set : data}, {upsert:true, multi:true}, function(error,result){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
        }
        callback(error,result);
    });
};


/**
 * Gets a list of documents.
 *
 * @method get
 * @async
 * @param {String} collection The collection to work on
 * @param {Object} criteria An object of criterias
 * @param {Object} projection Fields to return using
 * projection operators
 * @param {Number} limit An optional limit number of items to retrieve
 * @param {Function} callback The function to call when it's done
 *   - **Error** The error if an error occurred, null otherwise
 *   - **Array** The retrieved data
 */
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

MongoDatabase.prototype.search.count = function (cursor, callback){

}
