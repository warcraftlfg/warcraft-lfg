var assert = require("chai").assert;
var languagesCriterion = process.require("characters/utilities/mongo/criteria/languagesCriterion.js");

describe("languagesCriterion.add",function() {
    it("Should add one language", function (done) {
        var query = {language:'fakeLanguage'};
        var criteria = {};
        languagesCriterion.add(query,criteria);

        assert.deepEqual(criteria, {"ad.languages":{"$in":["fakeLanguage"]}});
        done();
    });
    it("Should add nothing", function (done) {
        var query = {};
        var criteria = {};
        languagesCriterion.add(query,criteria);

        assert.isUndefined(criteria["ad.languages"]);
        done();
    });

    it("Should two language", function (done) {
        var query = {language:['fakeLanguage','fakeLanguage2']};
        var criteria = {};
        languagesCriterion.add(query,criteria);
        assert.deepEqual(criteria, {"ad.languages":{"$in":["fakeLanguage","fakeLanguage2"]}});
        done();
    });
    it("Should add one language and keep criteria", function (done) {
        var query = {language:'fakeLanguage'};
        var criteria = {"fakeKey":"fakeValue"};
        languagesCriterion.add(query,criteria);

        assert.deepEqual(criteria, {fakeKey:"fakeValue","ad.languages":{"$in":["fakeLanguage"]}});
        done();
    });
});