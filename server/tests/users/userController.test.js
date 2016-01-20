var expect = require("chai").expect;
var sinon = require("sinon");
var userController = process.require("users/userController.js");

describe("userController",function() {


    it("userController.logout",function(done) {
        var req,res,spy,spy2;

        req = res = {};

        spy = res.status = sinon.spy();
        spy2 = res.send = sinon.spy();

        userController.logout(req, res);
        expect(spy.calledOnce).to.equal(true);
        expect(spy2.calledOnce).to.equal(true);

        done()
    });

    it("userController.getProfile",function(done) {
        var req,res,spy;

        req = res = {};
        spy = res.status = sinon.spy();
        spy = res.send = sinon.spy();

        userController.getProfile(req, res);
        expect(spy.calledOnce).to.equal(true);
        done();
    });


    it("userController.getCharacterAds",function(done) {
        var req,res,spy;

        req = res = {};
        spy = res.status = sinon.spy();
        spy = res.send = sinon.spy();

        userController.getCharacterAds(req, res);
        expect(spy.calledOnce).to.equal(true);
        done()
    });

    it("userController.getGuildAds",function(done) {
        var req,res,spy;

        req = res = {};
        spy = res.status = sinon.spy();
        spy = res.send = sinon.spy();

        userController.getGuildAds(req, res);
        expect(spy.calledOnce).to.equal(true);
        done()
    });

    it("userController.getCharacters",function(done) {
        var req,res,spy;

        req = res = {};
        spy = res.status = sinon.spy();
        spy = res.send = sinon.spy();

        userController.getCharacters(req, res);
        expect(spy.calledOnce).to.equal(true);
        done();
    });

    it("userController.getGuilds",function(done) {
        var req,res,spy;

        req = res = {};
        spy = res.status = sinon.spy();
        spy = res.send = sinon.spy();

        userController.getGuilds(req, res);
        expect(spy.calledOnce).to.equal(true);
        done();
    });

});