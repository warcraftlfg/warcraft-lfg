var assert = require("chai").assert;
var sinon = require("sinon");
var guildModel = process.require("guilds/guildModel.js");
var guildService = process.require("guilds/guildService.js");
var bnetAPI = process.require("api/bnet.js");


describe("guildService",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("guildService.setId",function() {
        it("Should setId of the guild", function (done) {
            sandbox.stub(bnetAPI, "getGuild", function (region,realm,name,params,callback){
                callback(null,{region:region,realm:"fakeRealm",name:"fakeName"});
            });
            sandbox.stub(guildModel, "upsert", function (criteria, doc, callback) {
                assert.equal(criteria.realm,"fakeRealm")
                callback(null);
            });
            guildService.setId("fakeRegion","dirtyFakeRealm","fakeName","fakeUserID", function (error) {
                assert.isNull(error);
                done();
            });
        });

        it("Should return an error from bnetApi.getGuild", function (done) {
            sandbox.stub(bnetAPI, "getGuild", function (region,realm,name,params,callback){
                callback(new Error("Fake Error"));
            });
            sandbox.stub(guildModel, "upsert", function (criteria, doc, callback) {
                callback(null);
            });
            guildService.setId("fakeRegion","fakeRealm","fakeName","fakeUserID", function (error) {
                assert.isNotNull(error);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
        it("Should return an error from guildModel.upsert", function (done) {
            sandbox.stub(bnetAPI, "getGuild", function (region,realm,name,params,callback){
                callback(null,{region:region,realm:"fakeRealm",name:"fakeName"});
            });
            sandbox.stub(guildModel, "upsert", function (criteria, doc, callback) {
                callback(new Error("Fake Error"));
            });
            guildService.setId("fakeRegion","fakeRealm","fakeName","fakeUserID", function (error) {
                assert.isNotNull(error);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });
    describe("guildService.find",function() {
        it("Should get lasts guilds", function (done) {
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
            sandbox.stub(guildModel, "find").returns(mockFind);
            guildService.find({},{},{},function (error,characters) {
                assert.equal(characters.length,2);
                assert.isNull(error);
                done();
            });
        });
    });
    describe("guildService.count",function() {
        it("Should get LFG guilds count", function (done) {
            sandbox.stub(guildModel, "count",function (criteria, callback) {
                callback(null,1);
            });
            guildService.count({},function (error,guildsCount) {
                assert.equal(guildsCount,1);
                assert.isNull(error);
                done();
            });
        });
    });

});