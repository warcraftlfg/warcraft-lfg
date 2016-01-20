var assert = require("chai").assert;
var request = require('request');
var applicationStorage = process.require("core/applicationStorage");
var userRoutes = process.require("users/routes.js");

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
    it("Should listen on /user/logout", function (done) {
        request.get({url:baseUrl+"/user/logout", rejectUnauthorized: false}, function (err, res){
            assert.isNull(err);
            assert.equal(res.statusCode,403);
            done();
        });
    });
    it("Should listen on /user/profile", function (done) {
        request.get({url:baseUrl+"/user/profile", rejectUnauthorized: false}, function (err, res, body){
            assert.isNull(err);
            assert.equal(res.statusCode,403);
            assert.equal(body,"");
            done();
        });
    });
    it("Should listen on /user/characters/fakeRegion", function (done) {
        request.get({url:baseUrl+"/user/characters/fakeRegion", rejectUnauthorized: false}, function (err, res, body){
            assert.isNull(err);
            assert.equal(res.statusCode,403);
            assert.equal(body,"");
            done();
        });
    });
    it("Should listen on /user/guilds/fakeRegion", function (done) {
        request.get({url:baseUrl+"/user/guilds/fakeRegion", rejectUnauthorized: false}, function (err, res, body){
            assert.isNull(err);
            assert.equal(res.statusCode,403);
            assert.equal(body,"");
            done();
        });
    });

    //TODO Get userCharacters Test
    //TODO Get userGuilds Test
});