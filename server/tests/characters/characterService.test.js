var assert = require("chai").assert;
var sinon = require("sinon");
var characterModel = process.require("characters/characterModel.js");
var characterService = process.require("characters/characterService.js");
var bnetAPI = process.require("core/api/bnet.js");


describe("characterService",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("characterService.setId",function() {
        it("Should setId of the character", function (done) {
            sandbox.stub(bnetAPI, "getCharacter", function (region,realm,name,params,callback){
                callback(null,{region:region,realm:"fakeRealm",name:"fakeName"});
            });
            sandbox.stub(characterModel, "upsert", function (criteria, doc, callback) {
                assert.equal(criteria.realm,"fakeRealm")
                callback(null);
            });
            characterService.setId("fakeRegion","dirtyFakeRealm","fakeName","fakeUserID", function (error) {
                assert.isNull(error);
                done();
            });
        });

        it("Should return an error from bnetApi.getCharacter", function (done) {
            sandbox.stub(bnetAPI, "getCharacter", function (region,realm,name,params,callback){
                callback(new Error("Fake Error"));
            });
            sandbox.stub(characterModel, "upsert", function (criteria, doc, callback) {
                callback(null);
            });
            characterService.setId("fakeRegion","fakeRealm","fakeName","fakeUserID", function (error) {
                assert.isNotNull(error);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
        it("Should return an error from characterModel.upsert", function (done) {
            sandbox.stub(bnetAPI, "getCharacter", function (region,realm,name,params,callback){
                callback(null,{region:region,realm:"fakeRealm",name:"fakeName"});
            });
            sandbox.stub(characterModel, "upsert", function (criteria, doc, callback) {
                callback(new Error("Fake Error"));
            });
            characterService.setId("fakeRegion","fakeRealm","fakeName","fakeUserID", function (error) {
                assert.isNotNull(error);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });
});