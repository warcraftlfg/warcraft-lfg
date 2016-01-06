var assert = require("chai").assert;
var sinon = require("sinon");

var realmZoneCriterion = process.require("core/db/criteria/realmZoneCriterion.js");
var realmModel = process.require("realms/realmModel.js");


describe("realmZoneCriterion",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });


    it("Should return 2 realms", function (done) {

        sandbox.stub(realmModel, "find", function (criteria, projection, callback) {
            callback(null,[{region:"fakeRegion",name:"fakeName"},{region:"fakeRegion",name:"fakeName2"}]);
        });
        var query = {realm_zone:"eu.fr_FR.Europe/Paris"};
        var criteria = {};

        realmZoneCriterion.add(query,criteria,function(error){
            assert.isNull(error);
            assert.equal(criteria["$or"][0].region,"fakeRegion");
            assert.equal(criteria["$or"][0].realm,"fakeName");
            assert.equal(criteria["$or"][1].region,"fakeRegion");
            assert.equal(criteria["$or"][1].realm,"fakeName2");
            done();
        });
    });
    it("Should return 2 realms and keep criteria", function (done) {

        sandbox.stub(realmModel, "find", function (criteria, projection, callback) {
            callback(null,[{region:"fakeRegion",name:"fakeName"},{region:"fakeRegion",name:"fakeName2"}]);
        });
        var query = {realm_zone:"eu.fr_FR.Europe/Paris"};
        var criteria = {"$or":["fakeCriterion"]};

        realmZoneCriterion.add(query,criteria,function(error){
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

        sandbox.stub(realmModel, "find", function (criteria, projection, callback) {
            callback(null,{});
        });
        var query = {};
        var criteria = {};

        realmZoneCriterion.add(query,criteria,function(error){
            assert.isUndefined(error);
            assert.isUndefined(criteria["$or"]);
            done();
        });
    });
    it("Should return error", function (done) {
        sandbox.stub(realmModel, "find", function (criteria, projection, callback) {
            callback(new Error("FakeError"));
        });
        var query = {realm_zone:"eu.fakeName"};
        var criteria = {};

        realmZoneCriterion.add(query,criteria,function(error){
            assert.isNotNull(error);
            done();
        });
    });

});

