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

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 3 criteria", function (done) {
        var query = {"realmZones":[
            "{\"region\":\"eu\",\"locale\":\"fr_FR\",\"zone\":\"Europe\",\"cities\":[\"Paris\"]}",
            "{\"region\":\"us\",\"locale\":\"en_US\",\"zone\":\"America\",\"cities\":[\"New York\",\"Chicago\"]}"
        ]};

        var criteria = {};
        zoneCriteria.add(query,criteria);

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
        var query = {"realmZones":"{\"region\":\"eu\",\"locale\":\"fr_FR\",\"zone\":\"Europe\",\"cities\":[\"Paris\"]}"};
        var criteria = {'$or':[{fakeKey:"fakeValue"}]};
        zoneCriteria.add(query,criteria);

        assert.equal(criteria["$or"].length,2);
        assert.equal(criteria["$or"][1].region,'eu');
        assert.equal(criteria["$or"][1]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][1]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {"realmZones":[
            "{\"region\":\"eu\",\"locale\":\"fr_FR\",\"zone\":\"Europe\",\"cities\":[\"Paris\"]}",
            "fakeString"
        ]};
        var criteria = {};
        zoneCriteria.add(query,criteria);

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });
    it("Should add 1 criterion", function (done) {
        var query = {"realmZones":[
            "{\"region\":\"eu\",\"locale\":\"fr_FR\",\"zone\":\"Europe\",\"fakeKey\":[\"Paris\"]}",
            "{\"region\":\"eu\",\"locale\":\"fr_FR\",\"zone\":\"Europe\",\"cities\":[\"Paris\"]}"
        ]};
        var criteria = {};
        zoneCriteria.add(query,criteria);

        assert.equal(criteria["$or"].length,1);
        assert.equal(criteria["$or"][0].region,'eu');
        assert.equal(criteria["$or"][0]['bnet.locale'],'fr_FR');
        assert.equal(criteria["$or"][0]['bnet.timezone'],'Europe/Paris');
        done();
    });


});