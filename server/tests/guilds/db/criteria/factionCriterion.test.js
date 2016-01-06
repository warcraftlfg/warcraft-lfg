var assert = require("chai").assert;
var factionCriterion = process.require("guilds/db/criteria/factionCriterion.js");

describe("factionCriterion.add",function() {
    it("Should add one criterion with bnet.side:0", function (done) {
        var query = {faction:'0'};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.equal(criteria["bnet.side"],0);
        done();
    });
    it("Should add one criterion with bnet.side:1", function (done) {
        var query = {faction:'1'};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.equal(criteria["bnet.side"],1);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.side"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {faction:""};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.equal(criteria["bnet.side"],0);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.side"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var criteria = {};
        factionCriterion.add(query,criteria);

        assert.isUndefined(criteria["bnet.side"]);
        done();
    });

});