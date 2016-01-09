var assert = require("chai").assert;
var transfertCriterion = process.require("characters/utilities/mongo/criteria/transfertCriterion.js");

describe("transfertCriterion.add",function() {
    it("Should add {ad.transfert = true}", function (done) {
        var query = {transfert:'true'};
        var criteria = {};
        transfertCriterion.add(query,criteria);

        assert.deepEqual(criteria, {"ad.transfert":true});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        transfertCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.transfert"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {transfert:'fakeValue'};
        var criteria = {};
        transfertCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.transfert"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {transfert:['fakeValue','fakeValue2']};
        var criteria = {};
        transfertCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.transfert"]);
        done();
    });

});