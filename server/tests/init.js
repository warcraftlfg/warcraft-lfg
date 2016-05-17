"use strict";

process.env.NODE_ENV = "test";
require("../server.js");
var assert = require("chai").assert;
var applicationStorage = process.require("core/applicationStorage.js");
var request = require('request');


beforeEach(function (done) {
    require('readyness').doWhen(done);
});

describe("Server Init",function() {
    it("Should have config", function (done) {
        assert.isNotNull(applicationStorage.config);
        done();
    });
    it("Should have mongoose database", function (done) {
        assert.isNotNull(applicationStorage.mongoose);
        done();
    });
    it("Should have redis database", function (done) {
        assert.isNotNull(applicationStorage.redis);
        done();
    });
    it("Should have socketIo", function (done) {
        assert.isNotNull(applicationStorage.socketIo);
        done();
    });
});