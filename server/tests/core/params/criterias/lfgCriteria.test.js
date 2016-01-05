var assert = require("chai").assert;
var lfgCriteria = process.require("core/params/lfgParam.js");

describe("lfgCriteria.add",function() {
    it("Should add {ad.lfg = true}", function (done) {
        var query = {lfg:'true'};
        var criteria = {};
        lfgCriteria.add(query,criteria);

        assert.equal(criteria["ad.lfg"],true);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        lfgCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var criteria = {};
        lfgCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var criteria = {};
        lfgCriteria.add(query,criteria);

        assert.isUndefined(criteria["ad.lfg"]);
        done();
    });

});