var assert = require("chai").assert;
var userModel = process.require("users/userModel.js");

describe("userModel",function() {
    it("Should upsert a new user", function (done) {
        var user = {id:1,battleTag:"test#1234",accessToken:"123456789"};
        userModel.update({id:user.id},user,{runValidators:true,upsert:true},function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should throw a ValidationError on battleTag & accessToken", function (done) {
        var user = {id:1,battleTag:null,accessToken:null};
        userModel.update({id:user.id},user,{runValidators:true,upsert:true},function(error){
            assert.isNotNull(error);
            assert.isNotNull(error.errors.battleTag);
            assert.isNotNull(error.errors.accessToken);
            done();
        });
    });
});