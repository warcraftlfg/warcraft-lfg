var assert = require("chai").assert;
var request = require('request');
var applicationStorage = process.require("api/applicationStorage");

describe("guildRouter",function() {
    var protocol = "http";
    if (applicationStorage.config.server.https)
        protocol = "https";
    var baseUrl = protocol+'://localhost:'+applicationStorage.config.server.port;

    it("Should listen on /api/realms", function (done) {
        request.get({url:baseUrl+"/api/realms", rejectUnauthorized: false}, function (err, res){
            assert.isNull(err);
            assert.equal(res.statusCode,200);
            done();
        });
    });
});