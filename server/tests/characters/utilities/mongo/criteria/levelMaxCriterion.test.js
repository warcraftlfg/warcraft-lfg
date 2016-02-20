var assert = require("chai").assert;
var levelMaxCriterion = process.require("characters/utilities/mongo/criteria/levelMaxCriterion.js");

describe("levelMaxCriterion.add",function() {
    it("Should add {bnet.level = true}", function (done) {
        var query = {level_max:'true'};
        var criteria = {};
        levelMaxCriterion.add(query,criteria);

        assert.deepEqual(criteria, {"bnet.level": {$gte:100}});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        levelMaxCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.level"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {level_max:'fakeValue'};
        var criteria = {};
        levelMaxCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.level"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {level_max:['fakeValue','fakeValue2']};
        var criteria = {};
        levelMaxCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.level"]);
        done();
    });

});