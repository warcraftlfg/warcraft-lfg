"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var logger = process.require("api/logger.js").get("logger");
var guildService = process.require("services/guildService.js");

function GuildUpdateProcess(){
    this.lock = false;
}

GuildUpdateProcess.prototype.updateGuild = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        guildService.updateNext(function(){
            self.lock = false;
            self.updateGuild();
        });
    }
};

GuildUpdateProcess.prototype.start = function(){
    logger.info("Starting GuildUpdateProcess");
    this.updateGuild();

};

module.exports = GuildUpdateProcess;