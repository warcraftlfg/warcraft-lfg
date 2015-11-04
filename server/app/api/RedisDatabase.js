"use strict";

//Module dependencies
var redis = require("redis");

// Configuration
var logger = process.require("api/logger.js").get("logger");


function RedisDatabase(databaseConf){

    this.conf = databaseConf;
}

module.exports = RedisDatabase;

RedisDatabase.prototype.connect = function(callback){

    var self = this;
    var options = {};
    options.host = this.conf.host;
    options.port = this.conf.port;
    this.db = redis.createClient(options);

    this.db.on("ready",function(){
        if (self.conf.password)
            self.db.auth(self.databaseConf.password);
        callback();
    });

    this.db.on("error",function(error){
        logger.error(error.message);
        callback(new Error("DATABASE_ERROR"));
    });
};

RedisDatabase.prototype.setUpdate = function(type,priority,key,value,callback){
    var self = this;
    value = JSON.stringify(value);
    this.db.set(type+'_'+key,value,function(error){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
            callback(error);
            return;
        }
        self.db.lpush(type+"_"+priority,type+'_'+key,function(error){
            if(error){
                logger.error(error.message);
                error = new Error("DATABASE_ERROR");
            }
            callback(error);
        });
    });
};

RedisDatabase.prototype.getUpdate = function(type,priority,callback){
    var self = this;
    this.db.rpop(type+"_"+priority,function(error,key){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
            callback(error);
            return;
        }
        if(key == null){
            callback();
            return;
        }
        self.db.get(key,function(error,value){
            if(error){
                logger.error(error.message);
                error = new Error("DATABASE_ERROR");
                return callback(error);

            }
            if (value == null)
                return callback(null,key);

            value = JSON.parse(value);
            self.db.del(key,function(error,result){
                if(error){
                    logger.error(error.message);
                    error = new Error("DATABASE_ERROR");
                }
                callback(error,value);
            });
        });
    });
};

RedisDatabase.prototype.getUpdateCount = function(type,priority,callback){
    this.db.llen(type+"_"+priority,function(error,value){
        if(error){
            logger.error(error.message);
            error = new Error("DATABASE_ERROR");
        }
        callback(error,value);
    });
};
