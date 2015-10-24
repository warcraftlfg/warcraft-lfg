"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var bnetAPI = process.require("api/bnet.js");
var logger = process.require("api/logger.js").get("logger");
var GuildUpdateModel = process.require("models/GuildUpdateModel.js");
var GuildModel = process.require("models/GuildModel.js");
var CharacterUpdateModel = process.require("models/CharacterUpdateModel.js");

function GuildUpdateProcess(){
    this.lock = false;
}

module.exports = GuildUpdateProcess;

GuildUpdateProcess.prototype.onDatabaseAvailable = function() {
    this.guildModel = new GuildModel();
    this.guildUpdateModel = new GuildUpdateModel();
    this.characterUpdateModel = new CharacterUpdateModel();
};

GuildUpdateProcess.prototype.updateGuild = function() {
    var self = this;
    if (self.lock == false) {
        self.lock = true;
        self.guildUpdateModel.getOlder(function(error,currentupdate){
            if(currentupdate) {
                self.guildUpdateModel.remove(currentupdate, function () {
                    bnetAPI.getGuild(currentupdate.region, currentupdate.realm, currentupdate.name, function (error,guild) {
                        if (!error && guild) {
                            self.guildModel.add(currentupdate.region, guild, function () {
                                logger.info('insert/update guild: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
                                self.lock = false;
                            });
                            guild.members.forEach(function (member){
                                var character = member.character;
                                self.characterUpdateModel.add(currentupdate.region,character.realm,character.name, function () {
                                    logger.info("Insert character to update "+ currentupdate.region +"-"+character.realm+"-"+character.name);
                                });
                            });
                        }
                        else {
                            self.lock = false;
                            logger.warn('Unable to fetch guild: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
                        }
                    });
                });
            }
            else{
                self.lock = false;
            }
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