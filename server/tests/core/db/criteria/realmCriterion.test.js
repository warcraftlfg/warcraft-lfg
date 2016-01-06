var assert = require("chai").assert;
var sinon = require("sinon");

var realmCriterion = process.require("core/db/criteria/realmCriterion.js");
var realmModel = process.require("realms/realmModel.js");


describe("realmCriterion",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });


    it("Should return 2 realms", function (done) {

        sandbox.stub(realmModel, "findOne", function (criteria, projection, callback) {
            callback(null,{region:"fakeRegion",name:"fakeName",connected_realms:["fakeName","fakeName2"]});
        });
        var query = {realm:"eu.fakeName"};
        var criteria = {};

        realmCriterion.add(query,criteria,function(error){
            assert.isNull(error);
            assert.equal(criteria["$or"][0].region,"fakeRegion");
            assert.equal(criteria["$or"][0].realm,"fakeName");
            assert.equal(criteria["$or"][1].region,"fakeRegion");
            assert.equal(criteria["$or"][1].realm,"fakeName2");
            done();
        });
    });
    it("Should return 4 realms", function (done) {

        sandbox.stub(realmModel, "findOne", function (criteria, projection, callback) {
            callback(null,{region:"fakeRegion",name:"fakeName",connected_realms:["fakeName","fakeName2"]});
        });
        var query = {realm:["eu.fakeName","eu.fakeName"]};
        var criteria = {};

        realmCriterion.add(query,criteria,function(error){
            assert.isNull(error);
            assert.equal(criteria["$or"][0].region,"fakeRegion");
            assert.equal(criteria["$or"][0].realm,"fakeName");
            assert.equal(criteria["$or"][1].region,"fakeRegion");
            assert.equal(criteria["$or"][1].realm,"fakeName2");
            assert.equal(criteria["$or"][2].region,"fakeRegion");
            assert.equal(criteria["$or"][2].realm,"fakeName");
            assert.equal(criteria["$or"][3].region,"fakeRegion");
            assert.equal(criteria["$or"][3].realm,"fakeName2");
            done();
        });
    });
    it("Should return 2 realms and keep criteria", function (done) {

        sandbox.stub(realmModel, "findOne", function (criteria, projection, callback) {
            callback(null,{region:"fakeRegion",name:"fakeName",connected_realms:["fakeName","fakeName2"]});
        });
        var query = {realm:"eu.fakeName"};
        var criteria = {"$or":["fakeCriterion"]};

        realmCriterion.add(query,criteria,function(error){
            assert.isNull(error);
            assert.equal(criteria["$or"][0],"fakeCriterion");
            assert.equal(criteria["$or"][1].region,"fakeRegion");
            assert.equal(criteria["$or"][1].realm,"fakeName");
            assert.equal(criteria["$or"][2].region,"fakeRegion");
            assert.equal(criteria["$or"][2].realm,"fakeName2");
            done();
        });
    });
    it("Should add nothing", function (done) {

        sandbox.stub(realmModel, "findOne", function (criteria, projection, callback) {
            callback(null,{});
        });
        var query = {};
        var criteria = {};

        realmCriterion.add(query,criteria,function(error){
            assert.isUndefined(error);
            assert.isUndefined(criteria["$or"]);
            done();
        });
    });
    it("Should return error", function (done) {
        sandbox.stub(realmModel, "findOne", function (criteria, projection, callback) {
            callback(new Error("FakeError"));
        });
        var query = {realm:"eu.fakeName"};
        var criteria = {};

        realmCriterion.add(query,criteria,function(error){
            assert.isNotNull(error);
            done();
        });
    });

});

