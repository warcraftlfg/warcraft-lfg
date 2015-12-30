var assert = require("chai").assert;
var characterModel = process.require("characters/characterModel.js");

describe("characterModel",function() {
    it("Should upsert a new character", function (done) {
        var character = {region:"fakeRegion",realm:"fakeRealm",name:"fakeName"};
        characterModel.upsert({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},character,function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should get the character with the id 0", function (done) {
        characterModel.findOne({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},function(error,character){
            assert.isNull(error);
            assert.isNotNull(character);
            assert.isNotNull(character.id);
            done();
        });
    });

    it("Should throw a ValidationError on region, realm & name", function (done) {
        var character = {region:null,realm:null,name:null};
        characterModel.upsert({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},character,function(error){
            assert.isNotNull(error);
            assert.isNotNull(error.errors.region);
            assert.isNotNull(error.errors.realm);
            assert.isNotNull(error.errors.name);
            done();
        });
    });

    it("Should get null", function (done) {
        characterModel.findOne({region:"fakeRegion2",realm:"fakeRealm2",name:"fakeName2"},function(error,character){
            assert.isNull(character);
            assert.isNull(error);
            done();
        });
    });

    it("Should set an id 1 to the character", function (done) {
        var character = {region:"fakeRegion",realm:"fakeRealm",name:"fakeName",id:1};
        characterModel.upsert({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},character,function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should get the character with the id 1", function (done) {
        characterModel.findOne({region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},function(error,character){
            assert.isNull(error);
            assert.isNotNull(character);
            assert.equal(character.id,1);
            done();
        });
    });
});