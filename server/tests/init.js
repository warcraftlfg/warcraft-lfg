"use strict";

process.env.NODE_ENV = "test";
require("../server.js");
var assert = require("chai").assert;
var applicationStorage = process.require("core/applicationStorage.js");


describe("Server Init",function() {
    it("Should test nothing ... I'm lazy ... only for Travis auto beta pull", function (done) {
        done();
    });
});