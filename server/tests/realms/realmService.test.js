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


});