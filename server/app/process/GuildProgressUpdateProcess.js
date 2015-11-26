"use strict";

//Module dependencies
var logger = process.require("api/logger.js").get("logger");
var guildProgressService = process.require("services/guildProgressService.js");

function GuildProgressUpdateProcess(){
}

GuildProgressUpdateProcess.prototype.updateGuildProgress = function() {
    var self = this;
    guildProgressService.updateNext(function(){
        self.updateGuildProgress();
    });
};

GuildProgressUpdateProcess.prototype.start = function(){
    logger.info("Starting GuildProgressUpdateProcess");
    this.updateGuildProgress();
};

module.exports = GuildProgressUpdateProcess;