var assert = require("chai").assert;
var dayCriterion = process.require("core/utilities/mongo/criteria/dayCriterion.js");

describe("dayCriterion.add",function() {
    it("Should add one criterion ", function (done) {
        var query = {day: 'fakeDay'};
        var criteria = {};
        dayCriterion.add(query, criteria);

        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.play_time.fakeDay.play":true}]}]});
        done();
    });
    it("Should add two criteria ", function (done) {
        var query = {day: ['fakeDay','fakeDay2']};
        var criteria = {};
        dayCriterion.add(query, criteria);

        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.play_time.fakeDay.play":true},{"ad.play_time.fakeDay2.play":true}]}]});
        done();
    });
    it("Should add nothing ", function (done) {
        var query = {fakeKey: 'fakeDay'};
        var criteria = {};
        dayCriterion.add(query, criteria);

        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing ", function (done) {
        var query = {day: 'fakeDay.fakeValue'};
        var criteria = {};
        dayCriterion.add(query, criteria);

        assert.deepEqual(criteria,{});
        done();
    });

});