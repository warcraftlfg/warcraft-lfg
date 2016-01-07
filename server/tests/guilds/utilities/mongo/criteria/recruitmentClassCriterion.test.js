var assert = require("chai").assert;
var recruitmentClassCriterion = process.require("guilds/utilities/mongo/criteria/recruitmentClassCriterion.js");

describe("recruitmentClassCriterion.add",function() {
    it("Should add tank warrior", function (done) {
        var query = {recruitment_class:"tank.1"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.tank.warrior":true}]}]});
        done();
    });
    it("Should add tank druid", function (done) {
        var query = {recruitment_class:"tank.11"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.tank.druid":true}]}]});
        done();
    });
    it("Should add tank paladin", function (done) {
        var query = {recruitment_class:"tank.2"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.tank.paladin":true}]}]});
        done();
    });
    it("Should add tank monk", function (done) {
        var query = {recruitment_class:"tank.10"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.tank.monk":true}]}]});
        done();
    });
    it("Should add tank deathknight", function (done) {
        var query = {recruitment_class:"tank.6"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.tank.deathknight":true}]}]});
        done();
    });
    it("Should add heal druid", function (done) {
        var query = {recruitment_class:"heal.11"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.heal.druid":true}]}]});
        done();
    });
    it("Should add heal priest", function (done) {
        var query = {recruitment_class:"heal.5"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.heal.priest":true}]}]});
        done();
    });
    it("Should add heal paladin", function (done) {
        var query = {recruitment_class:"heal.2"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.heal.paladin":true}]}]});
        done();
    });
    it("Should add heal shaman", function (done) {
        var query = {recruitment_class:"heal.7"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.heal.shaman":true}]}]});
        done();
    });
    it("Should add heal monk", function (done) {
        var query = {recruitment_class:"heal.10"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.heal.monk":true}]}]});
        done();
    });
    it("Should add melee_dps druid", function (done) {
        var query = {recruitment_class:"melee_dps.11"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.druid":true}]}]});
        done();
    });
    it("Should add melee_dps deathknight", function (done) {
        var query = {recruitment_class:"melee_dps.6"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.deathknight":true}]}]});
        done();
    });
    it("Should add melee_dps paladin", function (done) {
        var query = {recruitment_class:"melee_dps.2"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.paladin":true}]}]});
        done();
    });
    it("Should add melee_dps monk", function (done) {
        var query = {recruitment_class:"melee_dps.10"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.monk":true}]}]});
        done();
    });
    it("Should add melee_dps shaman", function (done) {
        var query = {recruitment_class:"melee_dps.7"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.shaman":true}]}]});
        done();
    });
    it("Should add melee_dps warrior", function (done) {
        var query = {recruitment_class:"melee_dps.1"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.warrior":true}]}]});
        done();
    });
    it("Should add melee_dps rogue", function (done) {
        var query = {recruitment_class:"melee_dps.4"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.melee_dps.rogue":true}]}]});
        done();
    });
    it("Should add ranged_dps druid", function (done) {
        var query = {recruitment_class:"ranged_dps.11"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.druid":true}]}]});
        done();
    });
    it("Should add ranged_dps priest", function (done) {
        var query = {recruitment_class:"ranged_dps.5"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.priest":true}]}]});
        done();
    });
    it("Should add ranged_dps shaman", function (done) {
        var query = {recruitment_class:"ranged_dps.7"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.shaman":true}]}]});
        done();
    });
    it("Should add ranged_dps hunter", function (done) {
        var query = {recruitment_class:"ranged_dps.3"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.hunter":true}]}]});
        done();
    });
    it("Should add ranged_dps warlock", function (done) {
        var query = {recruitment_class:"ranged_dps.9"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.warlock":true}]}]});
        done();
    });
    it("Should add ranged_dps mage", function (done) {
        var query = {recruitment_class:"ranged_dps.8"};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.mage":true}]}]});
        done();
    });
    it("Should add ranged_dps mage and heal druid", function (done) {
        var query = {recruitment_class:["ranged_dps.8","heal.11"]};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.recruitment.ranged_dps.mage":true},{"ad.recruitment.heal.druid":true}]}]});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {recruitment_class:["test.8","heal.22"]};
        var criteria = {};
        recruitmentClassCriterion.add(query,criteria);
        assert.deepEqual(criteria,{});
        done();
    });
});