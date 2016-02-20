"use strict";

var assert = require("chai").assert;
var guildProjection = process.require("guilds/utilities/mongo/guildProjection.js");

describe("guildProjection.get",function() {
    it("Should add minimal view criterion", function (done) {
        var query = {view:'minimal'};
        var projection = guildProjection.get(query);

        assert.equal(projection["bnet.side"],1);
        assert.equal(projection["ad.updated"],1);
        done();
    });
    it("Should add detailed view criterion", function (done) {
        var query = {view:'detailed'};
        var projection = guildProjection.get(query);

        assert.equal(projection["bnet.side"],1);
        assert.equal(projection["ad.language"],1);
        assert.equal(projection["ad.recruitment"],1);
        assert.equal(projection["ad.updated"],1);
        assert.equal(projection["wowProgress"],1);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var projection = guildProjection.get(query);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var projection = guildProjection.get(query);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var projection = guildProjection.get(query);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });

});