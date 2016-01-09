var assert = require("chai").assert;
var sinon = require("sinon");

var characterCriteria = process.require("characters/utilities/mongo/characterCriteria.js");

var lfgCriterion = process.require("core/utilities/mongo/criteria/lfgCriterion.js");
var factionCriterion = process.require("characters/utilities/mongo/criteria/factionCriterion.js");
var languagesCriterion = process.require("characters/utilities/mongo/criteria/languagesCriterion.js");
var raidsPerWeekCriterion = process.require("core/utilities/mongo/criteria/raidsPerWeekCriterion.js");
var dayCriterion = process.require("core/utilities/mongo/criteria/dayCriterion.js");
var progressCriterion = process.require("core/utilities/mongo/criteria/progressCriterion.js");
var roleCriterion = process.require("characters/utilities/mongo/criteria/roleCriterion.js");
var classCriterion = process.require("characters/utilities/mongo/criteria/classCriterion.js");
var lastCriterion = process.require("characters/utilities/mongo/criteria/lastCriterion.js");


var realmCriterion = process.require("core/utilities/mongo/criteria/realmCriterion.js");
var realmZoneCriterion = process.require("core/utilities/mongo/criteria/realmZoneCriterion.js");


describe("characterCriteria",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });


    it("Should return empty array", function (done) {

        sandbox.stub(lfgCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(factionCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(languagesCriterion, "add", function (query, criteria) {
        });

        sandbox.stub(raidsPerWeekCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(dayCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(progressCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(roleCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(classCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(lastCriterion, "add", function (query, criteria) {
        });

        sandbox.stub(realmCriterion, "add", function (query, criteria, callback) {
            callback()
        });
        sandbox.stub(realmZoneCriterion, "add", function (query, criteria, callback) {
            callback()
        });

        var query = {};

        characterCriteria.get(query,function(error,criteria){
            assert.deepEqual(criteria,{});
            done();
        });
    });


});

