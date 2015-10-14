"use strict"

//Module dependencies
var cronJob = require('cron').CronJob;
var CharacterUpdateModel = process.require("app/models/CharacterUpdateModel.js");
var CharacterModel = process.require("app/models/CharacterModel.js");
var bnetAPI = process.require("app/api/bnet.js");
var loggerCron = process.require("app/api/logger.js").get("cron");

function CharacterUpdateProcess(){
    this.lock = false;
}

module.exports = CharacterUpdateProcess;

CharacterUpdateProcess.prototype.onDatabaseAvailable = function(db) {
    this.characterModel = new CharacterModel();
    this.characterUpdateModel = new CharacterUpdateModel();
}

CharacterUpdateProcess.prototype.updateCharacter = function(){
    var self = this;
    if (self.lock == false){
        self.lock = true;
        self.characterUpdateModel.getOlder(function(error,currentupdate){
            if(currentupdate){
                self.characterUpdateModel.remove(currentupdate, function (error, result) {
                    bnetAPI.getCharacter(currentupdate.region,currentupdate.realm, currentupdate.name, function (character) {
                        if (character) {
                            self.characterModel.add(currentupdate.region, character, function (error, result) {
                                loggerCron.info('insert/update character: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
                                self.lock = false;
                            });
                        }
                        else {
                            self.lock = false;
                            loggerCron.warn('Unable to fetch user: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
                        }
                    });
                });
            }else {
                self.lock = false;
            }
        });
    }
};


CharacterUpdateProcess.prototype.start = function(){
    //Start Cron every sec
    var self=this;
    new cronJob('* * * * * *',
        function() {
            self.updateCharacter();
        },
        null,
        true
    );
}