var assert = require("chai").assert;
var userModel = process.require("users/userModel.js");

describe("userModel",function() {
    it("Should upsert a new user", function (done) {
        var user = {id:1,battleTag:"test#1234",accessToken:"123456789"};
        userModel.upsert({id:user.id},user,function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should throw a ValidationError on battleTag & accessToken", function (done) {
        var user = {id:1,battleTag:null,accessToken:null};
        userModel.upsert({id:user.id},user,function(error){
            assert.isNotNull(error);
            assert.isNotNull(error.errors.battleTag);
            assert.isNotNull(error.errors.accessToken);
            done();
        });
    });

    it("Should get empty user", function (done) {
        userModel.findOne({id:2},function(error,user){
            assert.isNull(user);
            assert.isNull(error);
            done();
        });
    });

    it("Should get the user", function (done) {
        userModel.findOne({id:1},function(error,user){
            assert.isNull(error);
            assert.isNotNull(user);
            done();
        });
    });
});