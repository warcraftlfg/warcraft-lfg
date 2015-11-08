"use strict";

// Module dependencies
var path = require("path");

// Set module root directory
process.root = path.join(__dirname, "../../server/app");
process.require = function(filePath){
    return require(path.normalize(process.root + "/" + filePath));
};

var assert = require("chai").assert;
var applicationStorage = process.require("api/applicationStorage.js");
var MongoDatabase = process.require("api/MongoDatabase.js");
var userModel = process.require("models/userModel.js");

describe("Users",function() {

    before(function(done){
        var db = new MongoDatabase({
                "host": "localhost",
                "port": 27017,
                "database": "warcraft-lfg-test"
        });

        db.connect(function(error) {
            if (error)
                return console.error(error.message);

            applicationStorage.setMongoDatabase(db);
            db.remove("users",{},function (error){
                if (error)
                    return console.error(error.message);
                done();
            });

        });
    });

    it("Should create a new user", function (done) {
        userModel.insertOrUpdate({id:1,battleTag:"test#1234",accessToken:"123456789"},function(error){
            assert.equal(error, null);
            done();
        });
    });

    it("Should return the new user", function (done) {
        userModel.findById(1,function(error,result){
            assert.equal(error, null);
            assert.equal(result.id, 1);
            assert.equal(result.battleTag, "test#1234");
            assert.equal(result.accessToken, 123456789);
            assert.equal(result._id, null);
            done();
        });
    });

    it("Should update the user", function (done) {
        userModel.insertOrUpdate({id:1,battleTag:"test#4321",accessToken:"987654321"},function(error){
            assert.equal(error, null);
            done();
        });
    });

    it("Should return nothing", function (done) {
        userModel.findById(2,function(error,result){
            assert.equal(error.message, "User not found");
            assert.equal(result, null);
            done();
        });
    });

    it("Should return the updated user", function (done) {
        userModel.findById(1,function(error,result){
            assert.equal(error, null);
            assert.equal(result.id, 1);
            assert.equal(result.battleTag, "test#4321");
            assert.equal(result.accessToken, 987654321);
            assert.equal(result._id, null);
            done();
        });
    });
});
