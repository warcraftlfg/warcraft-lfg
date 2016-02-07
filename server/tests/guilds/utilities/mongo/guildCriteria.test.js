var assert = require("chai").assert;
var sinon = require("sinon");

var guildCriteria = process.require("guilds/utilities/mongo/guildCriteria.js");

var lfgCriterion = process.require("core/utilities/mongo/criteria/lfgCriterion.js");
var factionCriterion = process.require("guilds/utilities/mongo/criteria/factionCriterion.js");
var languageCriterion = process.require("guilds/utilities/mongo/criteria/languageCriterion.js");
var recruitmentClassCriterion = process.require("guilds/utilities/mongo/criteria/recruitmentClassCriterion.js");
var raidsPerWeekCriterion = process.require("guilds/utilities/mongo/criteria/raidsPerWeekCriterion.js");
var dayCriterion = process.require("guilds/utilities/mongo/criteria/dayCriterion.js");
var progressCriterion = process.require("core/utilities/mongo/criteria/progressCriterion.js");
var lastCriterion = process.require("guilds/utilities/mongo/criteria/lastCriterion.js");


var realmCriterion = process.require("core/utilities/mongo/criteria/realmCriterion.js");
var realmZoneCriterion = process.require("core/utilities/mongo/criteria/realmZoneCriterion.js");


describe("guildCriteria",function() {

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
        sandbox.stub(languageCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(recruitmentClassCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(raidsPerWeekCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(dayCriterion, "add", function (query, criteria) {
        });
        sandbox.stub(progressCriterion, "add", function (query, criteria) {
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

        guildCriteria.get(query,function(error,criteria){
            assert.deepEqual(criteria,{});
            done();
        });
    });


});

