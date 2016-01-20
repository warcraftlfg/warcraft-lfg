var assert = require("chai").assert;
var lastCriterion = process.require("characters/utilities/mongo/criteria/lastCriterion.js");

describe("lastCriterion.add",function() {
    it("Should add a last criterion with date", function (done) {
        var query = {last:'000000000000.1',sort:'date'};
        var criteria = {};
        lastCriterion.add(query,criteria);
        //TODO Check criterion with date
        done();
    });
    it("Should add a last criterion with progress", function (done) {
        var query = {last:'000000000000.1',sort:'progress'};
        var criteria = {};
        lastCriterion.add(query,criteria);
        //TODO Check criterion with progress
        done();
    });
    it("Should add a last criterion with ranking", function (done) {
        var query = {last:'000000000000.1',sort:'ilevel'};
        var criteria = {};
        lastCriterion.add(query,criteria);
        //TODO Check criterion with ranking
        done();
    });
    it("Should return nothing", function (done) {
        var query = {fakeKey:'000000000000.1',sort:'ranking'};
        var criteria = {};
        lastCriterion.add(query,criteria);
        assert(criteria,{});
        done();
    });
    it("Should return nothing", function (done) {
        var query = {last:'fakeValue',sort:'ranking'};
        var criteria = {};
        lastCriterion.add(query,criteria);
        assert(criteria,{});
        done();
    });
    it("Should return nothing", function (done) {
        var query = {last:'fakeValue.fakeValue',sort:'ranking'};
        var criteria = {};
        lastCriterion.add(query,criteria);
        assert(criteria,{});
        done();
    });
});