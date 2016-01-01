var assert = require("chai").assert;
var realmModel = process.require("realms/realmModel.js");

describe("realmModel",function() {
    it("Should upsert a new realm", function (done) {
        var realm = {region:"fakeRegion",realm:"fakeRealm",name:"fakeName"};
        realmModel.upsert({region:"fakeRegion",name:"fakeName"},realm,function(error){
            assert.isNull(error);
            done();
        });
    });

    it("Should get the realm", function (done) {
        realmModel.findOne({region:"fakeRegion",name:"fakeName"},function(error,realm){
            assert.isNull(error);
            assert.isNotNull(realm);
            assert.equal(realm.region,"fakeRegion");
            assert.equal(realm.name, "fakeName")
            done();
        });
    });

    it("Should throw a ValidationError on region & name", function (done) {
        var realm = {region:null,realm:null,name:null};
        realmModel.upsert({region:"fakeRegion",name:"fakeName"},realm,function(error){
            assert.isNotNull(error);
            assert.isNotNull(error.errors.region);
            assert.isNotNull(error.errors.name);
            done();
        });
    });

    it("Should get null", function (done) {
        realmModel.findOne({region:"fakeRegion2",name:"fakeName2"},function(error,realm){
            assert.isNull(realm);
            assert.isNull(error);
            done();
        });
    });

});