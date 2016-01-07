var assert = require("chai").assert;
var raidsPerWeekCriterion = process.require("core/utilities/mongo/criteria/raidsPerWeekCriterion.js");

describe("raidsPerWeekCriterion.add",function() {
    it("Should add min 1 and max 7", function (done) {
        var query = {raids_per_week:'1.7'};
        var criteria = {};
        raidsPerWeekCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"ad.raids_per_week.min":{"$gte":1},"ad.raids_per_week.max":{"$lte":7}});
        done();
    });

    it("Should add nothing", function (done) {
        var query = {raids_per_week:'fakeValue.7'};
        var criteria = {};
        raidsPerWeekCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {raids_per_week:'1.fakeValue'};
        var criteria = {};
        raidsPerWeekCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });

    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        raidsPerWeekCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {raids_per_week:'fakeValue'};
        var criteria = {};
        raidsPerWeekCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {raids_per_week:['fakeValue','fakeValue2']};
        var criteria = {};
        raidsPerWeekCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });

});