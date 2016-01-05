var assert = require("chai").assert;
var factionCriteria = process.require("core/params/factionParam.js");

describe("factionCriteria.add",function() {
    it("Should add one criterion with bnet.side:0", function (done) {
        var query = {faction:'0'};
        var criteria = {};
        factionCriteria.add(query,criteria);

        assert.equal(criteria["bnet.side"],0);
        done();
    });
    it("Should add one criterion with bnet.side:1", function (done) {
        var query = {faction:'1'};
        var criteria = {};
        factionCriteria.add(query,criteria);

        assert.equal(criteria["bnet.side"],1);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        factionCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {faction:""};
        var criteria = {};
        factionCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var criteria = {};
        factionCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var criteria = {};
        factionCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });

});