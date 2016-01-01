var assert = require("chai").assert;
var sinon = require("sinon");
var realmModel = process.require("realms/realmModel.js");
var realmService = process.require("realms/realmService.js");


describe("guildService",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("realmService.find",function() {
        it("Should get lasts realms", function (done) {
            var mockFind = {
                sort: function () {
                    return this;
                },
                exec: function (callback) {
                    callback(null, [{region:"fakeRegion",name:"fakeName"},{region:"fakeRegion2",name:"fakeName2"}]);
                }
            };
            sandbox.stub(realmModel, "find").returns(mockFind);
            realmService.find({},function (error,realms) {
                assert.equal(realms.length,2);
                assert.isNull(error);
                done();
            });
        });
    });
});