"use strict"

/**
 * Application storage is a global storage to be
 * able to share information between modules
 */

var database;

/**
 * Gets the database.
 *
 * @method getDatabase
 * @return {Database} A Database object
 */
module.exports.getDatabase = function(){
    return database;
};

/**
 * Sets the database.
 *
 * @method getDatabase
 * @param {Database} newDatabase The new database of the application
 */
module.exports.setDatabase = function(newDatabase){
    database = newDatabase;
};