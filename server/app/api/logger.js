"use strict"

// Module dependencies
var winston = require("winston");

var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");


exports.get = function(name, conf){

    if(conf) {
        this.logger = new (winston.Logger)({
            level: config.logger.level,
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({
                    filename: config.logger.folder+"/"+env+".log",
                    maxsize : 104857600,
                    zippedArchive: true
                })
            ]
        });
    }
   return this.logger;
};