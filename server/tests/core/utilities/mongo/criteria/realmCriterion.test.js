var assert = require("chai").assert;
var sinon = require("sinon");

var realmCriterion = process.require("core/utilities/mongo/criteria/realmCriterion.js");
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
            assert.deepEqual(criteria,{"$and":[{"$or":[{region:"fakeRegion",realm:"fakeName"},{region:"fakeRegion",realm:"fakeName2"}]}]})

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
            assert.deepEqual(criteria,{"$and":[{"$or":[{region:"fakeRegion",realm:"fakeName"},{region:"fakeRegion",realm:"fakeName2"},{region:"fakeRegion",realm:"fakeName"},{region:"fakeRegion",realm:"fakeName2"}]}]})
            done();
        });
    });
    it("Should return 2 realms and keep criteria", function (done) {

        sandbox.stub(realmModel, "findOne", function (criteria, projection, callback) {
            callback(null,{region:"fakeRegion",name:"fakeName",connected_realms:["fakeName","fakeName2"]});
        });
        var query = {realm:"eu.fakeName"};
        var criteria = {"$and":[{"$or":[{"fakeKey":"fakeValue"}]}]};

        realmCriterion.add(query,criteria,function(error){
            assert.isNull(error);
            assert.deepEqual(criteria,{"$and":[{"$or":[{"fakeKey":"fakeValue"}]},{"$or":[{region:"fakeRegion",realm:"fakeName"},{region:"fakeRegion",realm:"fakeName2"}]}]})

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

