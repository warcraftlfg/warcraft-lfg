var assert = require("chai").assert;
var request = require('request');
var applicationStorage = process.require("api/applicationStorage");

describe("userRouter",function() {
    var protocol = "http";
    if (applicationStorage.config.server.https)
        protocol = "https";
    var baseUrl = protocol+'://localhost:'+applicationStorage.config.server.port;

    /*it("Should listen on /auth/bnet", function (done) {
        this.timeout(5000);
        request.get({url:baseUrl+"/auth/bnet", rejectUnauthorized: false}, function (err, res){
            assert.isNull(err);
            assert.equal(res.statusCode,200);
            done();
        });
    });
    it("Should listen on /auth/bnet/callback", function (done) {
        this.timeout(5000);
        request.get({url:baseUrl+"/auth/bnet/callback", rejectUnauthorized: false}, function (err, res){
            assert.isNull(err);
            assert.equal(res.statusCode,200);
            done();
        });
    });*/
    it("Should listen on /logout", function (done) {
        request.get({url:baseUrl+"/logout", rejectUnauthorized: false}, function (err, res){
            assert.isNull(err);
            assert.equal(res.statusCode,200);
            done();
        });
    });
    it("Should listen on /profile", function (done) {
        request.get({url:baseUrl+"/profile", rejectUnauthorized: false}, function (err, res, body){
            assert.isNull(err);
            assert.equal(res.statusCode,200);
            assert.equal(body,"");
            done();
        });
    });
});