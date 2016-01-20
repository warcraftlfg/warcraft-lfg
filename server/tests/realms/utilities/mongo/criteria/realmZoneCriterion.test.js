var assert = require("chai").assert;
var realmZoneCriterion = process.require("realms/utilities/mongo/criteria/realmZoneCriterion.js");

describe("realmZoneCriterion",function() {
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        realmZoneCriterion.add(query,criteria);
        assert.isUndefined(criteria["$or"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {realm_zone:"wrongString"};
        var criteria = {};
        realmZoneCriterion.add(query,criteria);
        assert.isUndefined(criteria["$or"]);
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {realm_zone:"eu.fr_FR.Europe/Paris"};
        var criteria = {};
        realmZoneCriterion.add(query,criteria);

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 3 criteria", function (done) {
        var query = {realm_zone:["eu.fr_FR.Europe/Paris","us.en_US.America/New York","us.en_US.America/Chicago"]};
        var criteria = {};
        realmZoneCriterion.add(query,criteria);

        assert.equal(criteria["$or"].length,3);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        assert.equal(criteria["$or"][1].region,'us');
        assert.equal(criteria["$or"][1]['bnet.locale'],'en_US');
        assert.equal(criteria["$or"][1]['bnet.timezone'],'America/New York');
        assert.equal(criteria["$or"][2].region,'us');
        assert.equal(criteria["$or"][2]['bnet.locale'],'en_US');
        assert.equal(criteria["$or"][2]['bnet.timezone'],'America/Chicago');
        done();
    });

    it("Should add 1 criteria and keep others", function (done) {
        var query = {realm_zone:"eu.fr_FR.Europe/Paris"};
        var criteria = {'$or':[{fakeKey:"fakeValue"}]};
        realmZoneCriterion.add(query,criteria);

        assert.equal(criteria["$or"].length,2);
        assert.equal(criteria["$or"][1].region,'eu');
        assert.equal(criteria["$or"][1]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][1]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {realm_zone:["eu.fr_FR.Europe/Paris","FakeString"]};

        var criteria = {};
        realmZoneCriterion.add(query,criteria);

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });
});