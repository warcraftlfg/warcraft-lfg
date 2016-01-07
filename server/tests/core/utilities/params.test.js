var assert = require("chai").assert;
var params = process.require("core/utilities/params.js");

describe("params.parseQueryParam",function() {
    it("Should return empty array", function (done) {
        var query = {};
        var obj = params.parseQueryParam(query.fakeParam,10);

        assert.equal(obj.length,0);
        done();
    });

    it("Should return one value", function (done) {
        var query = {fakeParam:"fakeValue"};
        var obj = params.parseQueryParam(query.fakeParam,1);

        assert.equal(obj.length,1);
        assert.equal(obj[0][0],"fakeValue");

        done();
    });

    it("Should return two value", function (done) {
        var query = {fakeParam:["fakeValue","fakeValue2"]};
        var obj = params.parseQueryParam(query.fakeParam,1);

        assert.equal(obj.length,2);
        assert.equal(obj[0][0],"fakeValue");
        assert.equal(obj[1][0],"fakeValue2");

        done();
    });


    it("Should return one value", function (done) {
        var query = {fakeParam:["fakeValue","notreturned.fakeValue2"]};
        var obj = params.parseQueryParam(query.fakeParam,1);

        assert.equal(obj.length,1);
        assert.equal(obj[0][0],"fakeValue");

        done();
    });
    it("Should return empty array", function (done) {
        var query = {fakeParam:"fakeValue"};
        var obj = params.parseQueryParam(query.fakeParam,2);

        assert.equal(obj.length,0);

        done();
    });
});