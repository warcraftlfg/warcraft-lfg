var assert = require("chai").assert;
var sinon = require("sinon");
var request = require("request");
var bnetAPI = process.require("api/bnet.js");

describe("bnet",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("bnet.getGuild",function() {
        it("It should return a guild", function (done) {
            sandbox.stub(bnetAPI, "requestBnetApi", function (region,endUrl, callback) {
                callback(null, {realm: "fakeRealm", name: "fakeName"});
            });
            bnetAPI.getGuild("fakeRegion", "fakeRealm", "fakeName", [], function (error, guild) {
                assert.equal(guild.realm, "fakeRealm");
                assert.equal(guild.name, "fakeName");
                done();
            });
        });
        it("It should return an error", function (done) {
            sandbox.stub(bnetAPI, "requestBnetApi", function (region, endUrl, callback) {
                callback(new Error("Fake Error"));
            });
            bnetAPI.getGuild("fakeRegion", "fakeRealm", "fakeName", [], function (error, guild) {
                assert.isNotNull(error);
                assert.isUndefined(guild);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });
    describe("bnet.getUserCharacters",function() {
        it("It should return a guild", function (done) {
            sandbox.stub(bnetAPI, "requestBnetApi", function (region, endUrl, callback) {
                callback(null, {characters:[{realm: "fakeRealm", name: "fakeName"}]});
            });
            bnetAPI.getUserCharacters("fakeRegion", "fakeAccessToken", function (error, characters) {
                assert.equal(characters[0].realm, "fakeRealm");
                assert.equal(characters[0].name, "fakeName");
                done();
            });
        });
        it("It should return an error", function (done) {
            sandbox.stub(bnetAPI, "requestBnetApi", function (region, endUrl, callback) {
                callback(new Error("Fake Error"));
            });
            bnetAPI.getUserCharacters("fakeRegion", "fakeAccessToken", function (error, characters) {
                assert.isNotNull(error);
                assert.isUndefined(characters);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });
    describe("bnet.requestBnetApi",function() {
        it("It should return a guild", function (done) {
            sandbox.stub(request, "get", function (params, callback) {
                callback(null,{statusCode:200},'{"id":"FakeId"}');
            });
            bnetAPI.requestBnetApi("fakeRegion", "fakeEndUrl", function (error, obj) {
                assert.isNull(error);
                assert.isNotNull(obj);
                assert.equal(obj.id,"FakeId");
                done();
            });
        });
        it("It should return a BNET_HTTP_ERROR", function (done) {
            sandbox.stub(request, "get", function (params, callback) {
                callback(null,{statusCode:400},'{"id":"FakeId"}');
            });
            bnetAPI.requestBnetApi("fakeRegion", "fakeEndUrl", function (error, obj) {
                assert.isUndefined(obj);
                assert.isNotNull(error);
                assert.equal(error.name,"BNET_HTTP_ERROR");
                done();
            });
        });
        it("It should return a BNET_HTTP_ERROR", function (done) {
            sandbox.stub(request, "get", function (params, callback) {
                callback(new Error("Fake Error"));
            });
            bnetAPI.requestBnetApi("fakeRegion", "fakeEndUrl", function (error, obj) {
                assert.isNotNull(error);
                assert.isUndefined(obj);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });

});