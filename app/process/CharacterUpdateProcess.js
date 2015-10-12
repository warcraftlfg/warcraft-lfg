"use strict"

//Module dependencies
var cronJob = require('cron').CronJob;
var CharacterUpdateModel = process.require("app/models/CharacterUpdateModel.js");
var CharacterModel = process.require("app/models/CharacterModel.js");
var bnetAPI = process.require("app/api/bnet.js");

//Configuration
var characterUpdateModel = new CharacterUpdateModel();
var characterModel;

function CharacterUpdateProcess(){
}

module.exports = CharacterUpdateProcess;

CharacterUpdateProcess.prototype.onDatabaseAvailable = function(db) {
    characterModel = new CharacterModel();
    this.database = db;
}

CharacterUpdateProcess.prototype.updateCharacter = function(){

    var self=this;
    this.database.search("character-updates", {}, {}, 1, 1, {_id:1}, function(error,result){
        if(result.length>0){
            var currentupdate = result[0];
            bnetAPI.getCharacter(currentupdate.region,currentupdate.realm, currentupdate.name, function (character) {
                character.region = currentupdate.region;
                characterModel.add(character, function (error, result) {
                    self.database.remove("character-updates",currentupdate,function(error,result){
                        console.log('insert/update '+ character.name+"-"+character.realm+"-"+character.region);
                    });
                });

            });
        }
        else
        {
            console.log('Nothing to update');
        }
    });
}


CharacterUpdateProcess.prototype.start = function(){
    //Start Cron every 10 sec
    var self=this;
    new cronJob('*/10 * * * * *',function() {
            self.updateCharacter();
        },null, true
    );
}