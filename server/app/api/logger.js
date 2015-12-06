"use strict"

/**
 * Provides functions to manage loggers.
 *
 * @module logger
 * @class logger
 * @main logger
 */

// Module dependencies
var winston = require("winston");

/**
 * Gets a new logger by its name or initializes one.
 *
 * @example
 *     var loggerAPI = require("logger.js");
 *
 *     var conf =  {
 *      "fileName" : "logs/wow-guild-recruit.log",
 *      "level" : "debug",
 *      "maxFileSize" : 1048576,
 *      "maxFiles" : 2
 *      };
 *
 *     // Initializes logger "wow-guild-recruit"
 *     var logger = loggerAPI.get("wow-guild-recruit", conf);
 *
 *     // Log something
 *     logger.info("A simple log");
 *
 * @example
 *     var loggerAPI = require("logger.js");
 *
 *     // Retrieve logger "wow-guild-recruit" which have already been initialized
 *     var logger = loggerAPI.get("wow-guild-recruit");
 *
 * @method get
 * @param {String} name The name of the logger
 * @param {Object} conf Logger configuration to initialize a new logger
 * Available debug levels are :
 *  - silly
 *  - debug
 *  - verbose
 *  - info
 *  - warn
 *  - error
 */
module.exports.get = function(name, conf){

    if(conf) {
        this.logger = new (winston.Logger)({
            level: conf.level,
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({
                    filename: conf.fileName,
                    maxsize : 1048576,
                    zippedArchive: true
                })
            ]
        });
    }
   return this.logger;
};