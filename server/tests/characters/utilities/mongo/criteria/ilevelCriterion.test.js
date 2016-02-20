var assert = require("chai").assert;
var ilevelCriterion = process.require("characters/utilities/mongo/criteria/ilevelCriterion.js");

describe("ilevelCriterion.add",function() {
    it("Should add min 100 and max 700", function (done) {
        var query = {ilevel:'100.700'};
        var criteria = {};
        ilevelCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"bnet.items.averageItemLevelEquipped":{"$lte":700,"$gte":100}});
        done();
    });

    it("Should add nothing", function (done) {
        var query = {ilevel:'fakeValue.700'};
        var criteria = {};
        ilevelCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {ilevel:'100.fakeValue'};
        var criteria = {};
        ilevelCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });

    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        ilevelCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {ilevel:'fakeValue'};
        var criteria = {};
        ilevelCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {ilevel:['fakeValue','fakeValue2']};
        var criteria = {};
        ilevelCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });

});