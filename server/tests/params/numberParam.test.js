var assert = require("chai").assert;
var numberParam = process.require("params/numberParam.js");

describe("numberParam.get",function() {
    it("Should get 2", function (done) {
        var query = {number:2};
        var number = numberParam.get(query);

        assert.equal(number,2);
        done();
    });
    it("Should get 10", function (done) {
        var query = {number:9999};
        var number = numberParam.get(query);

        assert.equal(number,10);
        done();
    });
    it("Should get 5", function (done) {
        var query = {};
        var number = numberParam.get(query);

        assert.equal(number,5);
        done();
    });
    it("Should get 0", function (done) {
        var query = {number:-5};
        var number = numberParam.get(query);

        assert.equal(number,0);
        done();
    });
});