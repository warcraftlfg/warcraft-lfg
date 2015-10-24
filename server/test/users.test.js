"use strict";

// Module dependencies
var path = require("path");

// Set module root directory
process.root = path.join(__dirname, "../../server/app");
process.require = function(filePath){
    return require(path.normalize(process.root + "/" + filePath));
};

var applicationStorage = process.require("api/applicationStorage.js");
var MongoDatabase = process.require("api/MongoDatabase.js");
var assert = require("chai").assert;
var proxyquire =  require('proxyquire').noCallThru();

var UserModel = proxyquire(process.root+"/models/UserModel.js", { bnetAPI: {bnetAPI:function(region,accessToken,callback){console.log("ICIIICI")}}});



describe("Users",function() {

    var userModel;
    before(function(done){
        var db = new MongoDatabase({
            "type": "mongodb",
                "host": "localhost",
                "port": 27017,
                "database": "wow-guild-recruitment",
                "username": "admin",
                "password": "password"
        });

        db.connect(function(error) {
            applicationStorage.setDatabase(db);
            userModel = new UserModel();
            db.remove("users",{},function (error,result){
                done();
            });

        });
    });

    it("Should create a new user", function (done) {
        userModel.insertOrUpdate({id:1,battletag:"test#1234",accessToken:"123456789"},function(error,result){
            assert.equal(error, null);
            done();
        });
    });

    it("Should return the new user", function (done) {
        userModel.findById(1,function(error,result){
            assert.equal(error, null);
            assert.equal(result.id, 1);
            assert.equal(result.battletag, "test#1234");
            assert.equal(result.accessToken, null);
            assert.equal(result._id, null);
            done();
        });
    });

    it("Should update the user", function (done) {
        userModel.insertOrUpdate({id:1,battletag:"test#4321",accessToken:"987654321"},function(error,result){
            assert.equal(error, null);
            done();
        });
    });

    it("Should return nothing", function (done) {
        userModel.findById(2,function(error,result){
            assert.equal(error, null);
            assert.equal(result, null);
            done();
        });
    });

    it("Should return the updated user", function (done) {
        userModel.findById(1,function(error,result){
            assert.equal(error, null);
            assert.equal(result.id, 1);
            assert.equal(result.battletag, "test#4321");
            assert.equal(result.accessToken, null);
            assert.equal(result._id, null);
            done();
        });
    });

    it("Should return the user accesstoken", function (done) {
        userModel.getAccessToken(1,function(error,result){
            assert.equal(error, null);
            assert.equal(result, 987654321);
            done();
        });
    });

    //TODO Tester l'import de character avec un stub
    it("Should return the user characters", function (done) {
        userModel.getCharacters("EU",1,function(error,result){

            done();
        });
    });










});
