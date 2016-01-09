var assert = require("chai").assert;
var roleCriterion = process.require("characters/utilities/mongo/criteria/roleCriterion.js");

describe("roleCriterion.add",function() {
    it("Should add one criterion fakeValue", function (done) {
        var query = {role:'fakeValue'};
        var criteria = {};
        roleCriterion.add(query,criteria);

        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.role.fakeValue":true}]}]});
        done();
    });
    it("Should add thwo criterion with bnet.side:1", function (done) {
        var query = {role:["fakeValue","fakeValue2"]};
        var criteria = {};
        roleCriterion.add(query,criteria);

        assert.deepEqual(criteria,{"$and":[{"$or":[{"ad.role.fakeValue":true},{"ad.role.fakeValue2":true}]}]})
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        roleCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});
        done();
    });



});