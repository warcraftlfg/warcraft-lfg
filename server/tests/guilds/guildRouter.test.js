var assert = require("chai").assert;
var request = require('request');
var applicationStorage = process.require("core/applicationStorage");

describe("guildRouter",function() {
    var protocol = "http";
    if (applicationStorage.config.server.https)
        protocol = "https";
    var baseUrl = protocol+'://localhost:'+applicationStorage.config.server.port;

    it("Should listen on /api/v1/guilds", function (done) {
        request.get({url:baseUrl+"/api/v1/guilds", rejectUnauthorized: false}, function (err, res){
            assert.isNull(err);
            assert.equal(res.statusCode,200);
            done();
        });
    });
});