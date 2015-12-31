var assert = require("chai").assert;
var guildModel = process.require("guilds/guildModel.js");

describe("guildModel",function() {
    it("Should upsert a new guild", function (done) {
        var guild = {region:"fakeRegion",realm:"fakeRealm",name:"fakeName"};
        guildModel.upsert({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},guild,function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should get the guild with the id 0", function (done) {
        guildModel.findOne({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},function(error,guild){
            assert.isNull(error);
            assert.isNotNull(guild);
            assert.isNotNull(guild.id);
            done();
        });
    });

    it("Should throw a ValidationError on region, realm & name", function (done) {
        var guild = {region:null,realm:null,name:null};
        guildModel.upsert({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},guild,function(error){
            assert.isNotNull(error);
            assert.isNotNull(error.errors.region);
            assert.isNotNull(error.errors.realm);
            assert.isNotNull(error.errors.name);
            done();
        });
    });

    it("Should get null", function (done) {
        guildModel.findOne({region:"fakeRegion2",realm:"fakeRealm2",name:"fakeName2"},function(error,guild){
            assert.isNull(guild);
            assert.isNull(error);
            done();
        });
    });

    it("Should set an id 1 to the guild", function (done) {
        var guild = {region:"fakeRegion",realm:"fakeRealm",name:"fakeName"};
        guildModel.upsert(guild,{$set:guild,$addToSet:{id:1}},function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should get the guild with the id 1", function (done) {
        guildModel.findOne({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},function(error,guild){
            assert.isNull(error);
            assert.isNotNull(guild);
            assert.sameMembers(guild.id,[1]);
            done();
        });
    });

    it("Should get the guilds count", function (done) {
        guildModel.count({},function(error,guildsCount){
            assert.isNull(error);
            assert.isNotNull(guildsCount);
            done();
        });
    });
});