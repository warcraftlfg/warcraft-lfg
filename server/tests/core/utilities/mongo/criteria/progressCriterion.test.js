var assert = require("chai").assert;
var progressCriterion = process.require("core/utilities/mongo/criteria/progressCriterion.js");
var applicationStorage = process.require("core/applicationStorage.js");

describe("progressCriterion.add",function() {
    /*it("Should add 3000", function (done) {

        var config = applicationStorage.config;
        var raid = config.progress.raids[0];

        var query = {progress:'normal.2'};
        var criteria = {};
        progressCriterion.add(query,criteria);

        var resultObj = {};
        resultObj["progress."+raid.name+".score"] = {$lt: 3000};
        assert.deepEqual(criteria,resultObj);

        done();
    });
    it("Should add 300000", function (done) {

        var config = applicationStorage.config;
        var raid = config.progress.raids[0];

        var query = {progress:'heroic.2'};
        var criteria = {};
        progressCriterion.add(query,criteria);

        var resultObj = {};
        resultObj["progress."+raid.name+".score"] = {$lt: 300000};
        assert.deepEqual(criteria,resultObj);

        done();
    });

    it("Should add 30000000", function (done) {

        var config = applicationStorage.config;
        var raid = config.progress.raids[0];

        var query = {progress:'mythic.2'};
        var criteria = {};
        progressCriterion.add(query,criteria);

        var resultObj = {};
        resultObj["progress."+raid.name+".score"] = {$lt: 30000000};
        assert.deepEqual(criteria,resultObj);

        done();
    });
    it("Should add nothing", function (done) {

        var config = applicationStorage.config;
        var raid = config.progress.raids[0];

        var query = {fakeKey:'fakeValue'};
        var criteria = {};
        progressCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});

        done();
    });
    it("Should add nothing", function (done) {

        var config = applicationStorage.config;
        var raid = config.progress.raids[0];

        var query = {progress:'fakeValue'};
        var criteria = {};
        progressCriterion.add(query,criteria);

        assert.deepEqual(criteria,{});

        done();
    });*/
});