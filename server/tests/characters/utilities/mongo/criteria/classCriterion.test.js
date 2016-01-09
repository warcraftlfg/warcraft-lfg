var assert = require("chai").assert;
var classCriterion = process.require("characters/utilities/mongo/criteria/classCriterion.js");

describe("classCriterion.add",function() {
    it("Should add one language", function (done) {
        var query = {class:"1"};
        var criteria = {};
        classCriterion.add(query,criteria);

        assert.deepEqual(criteria, {"bnet.class":{"$in":[1]}});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        classCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.class"]);
        done();
    });

    it("Should two language", function (done) {
        var query = {class:['1','2']};
        var criteria = {};
        classCriterion.add(query,criteria);
        assert.deepEqual(criteria, {"bnet.class":{"$in":[1,2]}});
        done();
    });
    it("Should add one language and keep criteria", function (done) {
        var query = {class:'1'};
        var criteria = {"fakeKey":"fakeValue"};
        classCriterion.add(query,criteria);

        assert.deepEqual(criteria, {fakeKey:"fakeValue","bnet.class":{"$in":[1]}});
        done();
    });
});