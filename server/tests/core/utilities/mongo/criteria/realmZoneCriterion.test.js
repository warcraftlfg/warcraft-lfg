var assert = require("chai").assert;
var sinon = require("sinon");

var realmZoneCriterion = process.require("core/utilities/mongo/criteria/realmZoneCriterion.js");
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
            assert.deepEqual(criteria,{"$and":[{"$or":[{region:"fakeRegion",realm:"fakeName"},{region:"fakeRegion",realm:"fakeName2"}]}]})
            done();
        });
    });
    it("Should return 2 realms and keep criteria", function (done) {

        sandbox.stub(realmModel, "find", function (criteria, projection, callback) {
            callback(null,[{region:"fakeRegion",name:"fakeName"},{region:"fakeRegion",name:"fakeName2"}]);
        });
        var query = {realm_zone:"eu.fr_FR.Europe/Paris"};
        var criteria = {"$and":[{"$or":[{"fakeKey":"fakeValue"}]}]};

        realmZoneCriterion.add(query,criteria,function(error){
            assert.isNull(error);
            assert.deepEqual(criteria,{"$and":[{"$or":[{"fakeKey":"fakeValue"}]},{"$or":[{region:"fakeRegion",realm:"fakeName"},{region:"fakeRegion",realm:"fakeName2"}]}]});
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

