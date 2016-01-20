"use strict";

var assert = require("chai").assert;
var characterProjection = process.require("characters/utilities/mongo/characterProjection.js");

describe("characterProjection.get",function() {
    it("Should add minimal view criterion", function (done) {
        var query = {view:'minimal'};
        var projection = characterProjection.get(query);

        assert.equal(projection["bnet.faction"],1);
        assert.equal(projection["ad.updated"],1);
        assert.equal(projection["bnet.class"],1);

        done();
    });
    it("Should add detailed view criterion", function (done) {
        var query = {view:'detailed'};
        var projection = characterProjection.get(query);


        assert.equal(projection["ad.raids_per_week"],1);
        assert.equal(projection["ad.languages"],1);
        assert.equal(projection["ad.role"],1);
        assert.equal(projection["ad.updated"],1);

        assert.equal(projection["bnet.level"],1);
        assert.equal(projection["bnet.class"],1);
        assert.equal(projection["bnet.items.averageItemLevelEquipped"],1);
        assert.equal(projection["bnet.items.finger1"],1);
        assert.equal(projection["bnet.items.finger2"],1);
        assert.equal(projection["bnet.faction"],1);
        assert.equal(projection["bnet.guild.name"],1);
        assert.equal(projection["bnet.progression.raids"],1);
        assert.equal(projection["warcraftLogs.logs"],1);

        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var projection = characterProjection.get(query);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:'fakeValue'};
        var projection = characterProjection.get(query);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {lfg:['fakeValue','fakeValue2']};
        var projection = characterProjection.get(query);

        assert.isUndefined(projection["ad.lfg"]);
        done();
    });

});