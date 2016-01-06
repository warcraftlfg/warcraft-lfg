var assert = require("chai").assert;
var lfgCriterion = process.require("core/db/criteria/lfgCriterion.js");

describe("lfgCriterion.add",function() {
    it("Should add {ad.lfg = true}", function (done) {
        var query = {lfg:'true'};
        var criteria = {};
        lfgCriterion.add(query,criteria);

        assert.equal(criteria["ad.lfg"],true);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        lfgCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var criteria = {};
        lfgCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var criteria = {};
        lfgCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });

});