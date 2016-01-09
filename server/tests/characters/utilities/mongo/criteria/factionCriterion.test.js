var assert = require("chai").assert;
var factionCriterion = process.require("characters/utilities/mongo/criteria/factionCriterion.js");

describe("factionCriterion.add",function() {
    it("Should add one criterion with bnet.side:0", function (done) {
        var query = {faction:'0'};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.equal(criteria["bnet.faction"],0);
        done();
    });
    it("Should add one criterion with bnet.side:1", function (done) {
        var query = {faction:'1'};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.equal(criteria["bnet.faction"],1);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {faction:""};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });


});