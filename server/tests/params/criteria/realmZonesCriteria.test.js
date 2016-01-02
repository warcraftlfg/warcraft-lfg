var assert = require("chai").assert;
var zoneCriteria = process.require("params/criteria/realmZonesCriteria.js");

describe("realmZoneCriteria",function() {
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        zoneCriteria.add(query,criteria);
        assert.isUndefined(criteria["$or"]);
        done();
    });
    it("Should add nothing", function (done) {
        var query = {realmZones:"wrongString"};
        var criteria = {};
        zoneCriteria.add(query,criteria);
        assert.isUndefined(criteria["$or"]);
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {"realmZones":"{\"region\":\"eu\",\"locale\":\"fr_FR\",\"zone\":\"Europe\",\"cities\":[\"Paris\"]}"};
        var criteria = {};
        zoneCriteria.add(query,criteria);

        console.log(criteria);
        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 2 criteria", function (done) {
        var query = {zone:["eu--fr_FR--Europe/Paris","us--en_US--America/New York"]};
        var criteria = {};
        zoneCriteria.add(query,criteria);

        assert.equal(criteria["$or"].length,2);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        assert.equal(criteria["$or"][1].region,'us');
        assert.equal(criteria["$or"][1]['bnet.locale'],'en_US');
        assert.equal(criteria["$or"][1]['bnet.timezone'],'America/New York');
        done();
    });

    it("Should add 1 criteria and keep others", function (done) {
        var query = {zone:"eu--fr_FR--Europe/Paris"};
        var criteria = {'$or':[{fakeKey:"fakeValue"}]};
        zoneCriteria.add(query,criteria);

        console.log(criteria["$or"][1]);
        assert.equal(criteria["$or"].length,2);
        assert.equal(criteria["$or"][1].region,'eu');
        assert.equal(criteria["$or"][1]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][1]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {zone:["eu--fr_FR--Europe/Paris","fakeString"]};
        var criteria = {};
        zoneCriteria.add(query,criteria);

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {zone:["fakeString","eu--fr_FR--Europe/Paris"]};
        var criteria = {};
        zoneCriteria.add(query,criteria);

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });


});