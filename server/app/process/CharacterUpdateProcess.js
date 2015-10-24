"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var characterService = process.require("services/characterService.js");

function CharacterUpdateProcess(){
    this.lock = false;
}

CharacterUpdateProcess.prototype.updateCharacter = function(){
    var self = this;
    if (self.lock == false){
        self.lock = true;
        characterService.updateLastCharacter(function(error){
            if (error){
                logger.error(error.message);
            }
            self.lock = false;
        });
    }
};


CharacterUpdateProcess.prototype.start = function(){
    logger.info("Starting CharacterUpdateProcess");
    //Start Cron every sec
    var self=this;
    new cronJob('* * * * * *',
        function() {
            self.updateCharacter();
        },
        null,
        true
    );
};

module.exports = CharacterUpdateProcess;
