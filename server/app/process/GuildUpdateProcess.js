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
        guildService.updateLastGuild(function(error){
            if (error){
                logger.error(error.message);
            }
            self.lock = false;
        });
    }
};

GuildUpdateProcess.prototype.start = function(){
    logger.info("Starting GuildUpdateProcess");

    //Start Cron every sec
    var self=this;
    new cronJob('* * * * * *',
        function() {
            self.updateGuild();
        },
        null,
        true
    );
};

module.exports = GuildUpdateProcess;