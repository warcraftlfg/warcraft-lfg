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
        characterService.updateNext(function(){
            self.lock = false;
            self.updateCharacter();

        });
    }
};


CharacterUpdateProcess.prototype.start = function(){
    logger.info("Starting CharacterUpdateProcess");
    this.updateCharacter();
};

module.exports = CharacterUpdateProcess;
