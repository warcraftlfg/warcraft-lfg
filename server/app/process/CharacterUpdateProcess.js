"use strict";

//Module dependencies
var logger = process.require("api/logger.js").get("logger");
var characterService = process.require("services/characterService.js");

function CharacterUpdateProcess(){
}

CharacterUpdateProcess.prototype.updateCharacter = function(){
    var self = this;
    characterService.updateNext(function(){
        self.updateCharacter();
    });
};


CharacterUpdateProcess.prototype.start = function(){
    logger.info("Starting CharacterUpdateProcess");
    this.updateCharacter();
};

module.exports = CharacterUpdateProcess;
