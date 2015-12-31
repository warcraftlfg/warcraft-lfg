var assert = require("chai").assert;
var sinon = require("sinon");
var characterModel = process.require("characters/characterModel.js");
var characterService = process.require("characters/characterService.js");
var bnetAPI = process.require("api/bnet.js");


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
    describe("characterService.find",function() {
        it("Should get last characters", function (done) {
            var mockFind = {
                sort: function () {
                    return this;
                },
                limit: function () {
                    return this;
                },
                exec: function (callback) {
                    callback(null, [{region:"fakeRegion",realm:"fakeRealm",name:"fakeName"},{region:"fakeRegion2",realm:"fakeRealm2",name:"fakeName2"}]);
                }
            };
            sandbox.stub(characterModel, "find").returns(mockFind);
            characterService.find({},{},{},function (error,characters) {
                assert.equal(characters.length,2);
                assert.isNull(error);
                done();
            });
        });
    });
    describe("characterService.count",function() {
        it("Should get LFG characters count", function (done) {
            sandbox.stub(characterModel, "count", function (criteria, callback) {
                callback(null,1);
            });
            characterService.count({},function (error,charactersCount){
                assert.equal(charactersCount,1);
                assert.isNull(error);
                done();
            });
        });
    });
});