var assert = require("chai").assert;
var guildViewProjection = process.require("params/projections/guildViewProjection.js");

describe("guildViewProjection.add",function() {
    it("Should add minimal view criterion", function (done) {
        var query = {view:'minimal'};
        var projection = {};
        guildViewProjection.add(query,projection);

        assert.equal(projection["bnet.side"],1);
        assert.equal(projection["ad.updated"],1);
        done();
    });
    it("Should add detailed view criterion", function (done) {
        var query = {view:'detailed'};
        var projection = {};
        guildViewProjection.add(query,projection);

        assert.equal(projection["bnet.side"],1);
        assert.equal(projection["ad"],1);
        assert.equal(projection["wowProgress"],1);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var projection = {};
        guildViewProjection.add(query,projection);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var projection = {};
        guildViewProjection.add(query,projection);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var projection = {};
        guildViewProjection.add(query,projection);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });

});