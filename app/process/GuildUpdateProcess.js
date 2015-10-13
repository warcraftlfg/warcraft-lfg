"use strict"

//Module dependencies
var cronJob = require('cron').CronJob;
var bnetAPI = process.require("app/api/bnet.js");
var loggerCron = process.require("app/api/logger.js").get("cron");
var GuildUpdateModel = process.require("app/models/GuildUpdateModel.js");
var GuildModel = process.require("app/models/GuildModel.js");
var CharacterUpdateModel = process.require("app/models/CharacterUpdateModel.js");

function GuildUpdateProcess(){
    this.lock = false;
}

module.exports = GuildUpdateProcess;

GuildUpdateProcess.prototype.onDatabaseAvailable = function(db) {
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
                self.guildUpdateModel.remove(currentupdate, function (error, result) {
                    bnetAPI.getGuild(currentupdate.region, currentupdate.realm, currentupdate.name, function (guild) {
                        if (guild) {
                            self.guildModel.add(currentupdate.region, guild, function (error, result) {
                                loggerCron.info('insert/update guild: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
                                self.lock = false;
                            });
                            guild.members.forEach(function (member){
                                var character = member.character;
                                self.characterUpdateModel.add(currentupdate.region,character.realm,character.name, function (error, result) {
                                    loggerCron.info("Insert character to update "+ currentupdate.region +"-"+character.realm+"-"+character.name);
                                });
                            });
                        }
                        else {
                            self.lock = false;
                            loggerCron.warn('Unable to fetch guild: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
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
    //Start Cron every sec
    var self=this;
    new cronJob('* * * * * *',
        function() {
            self.updateGuild();
        },
        null,
        true
    );
}