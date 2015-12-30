var assert = require("chai").assert;
var updateModel = process.require("updates/updateModel.js");
var applicationStorage = process.require("api/applicationStorage.js");

describe("updateModel",function() {
    var config = applicationStorage.config;
    it("Should upsert a new update", function (done) {
        updateModel.upsert("fakeType","fakeRegion","fakeRealm","fakeName",config.priorities[0], function (error) {
            assert.isNull(error);
            done();
        });
    });
    it("Should throw an error on type param required", function (done) {
        updateModel.upsert(null,"fakeRegion","fakeRealm","fakeName",config.priorities[0], function (error) {
            assert.isNotNull(error);
            assert.equal(error.message,"Field type is required in updateModel");
            done();
        });
    });
    it("Should throw an error on region param required", function (done) {
        updateModel.upsert("fakeType",null,"fakeRealm","fakeName",config.priorities[0], function (error) {
            assert.isNotNull(error);
            assert.equal(error.message,"Field region is required in updateModel");
            done();
        });
    });
    it("Should throw an error on realm param required", function (done) {
        updateModel.upsert("fakeType","fakeRegion",null,"fakeName",config.priorities[0], function (error) {
            assert.isNotNull(error);
            assert.equal(error.message,"Field realm is required in updateModel");
            done();
        });
    });
    it("Should throw an error on name param required", function (done) {
        updateModel.upsert("fakeType","fakeRegion","fakeRealm",null,config.priorities[0], function (error) {
            assert.isNotNull(error);
            assert.equal(error.message,"Field name is required in updateModel");
            done();
        });
    });
    it("Should throw an error on priority param required", function (done) {
        updateModel.upsert("fakeType","fakeRegion","fakeRealm","fakeName",null, function (error) {
            assert.isNotNull(error);
            assert.equal(error.message,"Field priority is required in updateModel");
            done();
        });
    });
    it("Should throw an error on priority param not in config file", function (done) {
        updateModel.upsert("fakeType","fakeRegion","fakeRealm","fakeName","fakePriority", function (error) {
            assert.isNotNull(error);
            assert.equal(error.message,"Priority param is not set in config file");
            done();
        });
    });
});