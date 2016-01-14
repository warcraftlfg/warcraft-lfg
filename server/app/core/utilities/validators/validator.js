"use strict";

var async = require("async");
var regionValidator = process.require("core/utilities/validators/regionValidator.js");
var realmValidator = process.require("core/utilities/validators/realmValidator.js");
var nameValidator = process.require("core/utilities/validators/nameValidator.js");
var idValidator = process.require("core/utilities/validators/idValidator.js");

module.exports.validate = function(params,callback){

    async.series([
        function(callback){
            if(params.hasOwnProperty("region")){
                regionValidator.validate(params.region,function(error){
                    callback(error);
                });
            }
            else{
                callback();
            }
        },
        function(callback){
            if(params.hasOwnProperty("realm")){
                realmValidator.validate(params.realm,function(error){
                    callback(error);
                });
            }
            else{
                callback();
            }
        },
        function(callback){
            if(params.hasOwnProperty("name")){
                nameValidator.validate(params.name,function(error){
                    callback(error);
                });
            }
            else{
                callback();
            }
        },
        function(callback){
            if(params.hasOwnProperty("id")){
                idValidator.validate(params.id,function(error){
                    callback(error);
                });
            }
            else{
                callback();
            }
        }
    ],function(error){
        callback(error);
    });


};
