var assert = require("chai").assert;
var languageCriterion = process.require("core/utilities/mongo/criteria/languageCriterion.js");

describe("languageCriterion.add",function() {
    it("Should add one language", function (done) {
        var query = {language:'fakeLanguage'};
        var criteria = {};
        languageCriterion.add(query,criteria);

        assert.deepEqual(criteria, {"ad.language":{"$in":["fakeLanguage"]}});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        languageCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.language"]);
        done();
    });

    it("Should two language", function (done) {
        var query = {language:['fakeLanguage','fakeLanguage2']};
        var criteria = {};
        languageCriterion.add(query,criteria);
        assert.deepEqual(criteria, {"ad.language":{"$in":["fakeLanguage","fakeLanguage2"]}});
        done();
    });
    it("Should add one language and keep criteria", function (done) {
        var query = {language:'fakeLanguage'};
        var criteria = {"fakeKey":"fakeValue"};
        languageCriterion.add(query,criteria);

        assert.deepEqual(criteria, {fakeKey:"fakeValue","ad.language":{"$in":["fakeLanguage"]}});
        done();
    });
});