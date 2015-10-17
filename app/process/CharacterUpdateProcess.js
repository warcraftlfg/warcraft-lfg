"use strict";

//Module dependencies
var cronJob = require('cron').CronJob;
var CharacterUpdateModel = process.require("app/models/CharacterUpdateModel.js");
var CharacterModel = process.require("app/models/CharacterModel.js");
var bnetAPI = process.require("app/api/bnet.js");
var logger = process.require("app/api/logger.js").get("logger");

function CharacterUpdateProcess(){
    this.lock = false;
}

module.exports = CharacterUpdateProcess;

CharacterUpdateProcess.prototype.onDatabaseAvailable = function() {
    this.characterModel = new CharacterModel();
    this.characterUpdateModel = new CharacterUpdateModel();
};

CharacterUpdateProcess.prototype.updateCharacter = function(){
    var self = this;
    if (self.lock == false){
        self.lock = true;
        self.characterUpdateModel.getOlder(function(error,currentupdate){
            if(currentupdate){
                self.characterUpdateModel.remove(currentupdate, function () {
                    bnetAPI.getCharacter(currentupdate.region,currentupdate.realm, currentupdate.name, function (error,character) {
                        if (!error && character) {
                            self.characterModel.add(currentupdate.region, character, function () {
                                logger.info('insert/update character: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
                                self.lock = false;
                            });
                        }
                        else {
                            self.lock = false;
                            logger.warn('Unable to fetch user: ' + currentupdate.region + "-" + currentupdate.realm + "-" + currentupdate.name);
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
};