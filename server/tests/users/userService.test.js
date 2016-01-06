var assert = require("chai").assert;
var sinon = require("sinon");
var userModel = process.require("users/userModel.js");
var userService = process.require("users/userService.js");
var guildService = process.require("guilds/guildService.js");
var characterService = process.require("characters/characterService.js");
var updateModel = process.require("updates/updateModel.js");
var applicationStorage = process.require("core/applicationStorage.js");
var bnetAPI = process.require("core/api/bnet.js");

describe("userService",function() {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("userService.setGuildsToUpdate",function() {
        it("Should set 4 guilds to update", function (done) {
            var count = 0;

            sandbox.stub(userService, "getGuilds", function (region, id, callback) {
                callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(updateModel, "upsert", function (type,region,realm,name,priority,callback){
                count ++;
                assert.equal(type,"gu");
                assert.equal(priority,0);
                callback();
                if(count == 4)
                    done();
            });

            userService.setGuildsToUpdate('fakeUserID');
        });
        it("Should get 3 guilds to update", function (done) {
            var count = 0;

            sandbox.stub(userService, "getGuilds", function (region, id, callback) {
                if(region == applicationStorage.config.bnetRegions[1])
                    callback(new Error("Fake Error"));
                else
                    callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(updateModel, "upsert", function (type,region,realm,name,priority,callback){
                count ++;
                callback();
                if(count == 3)
                    done();
            });

            userService.setGuildsToUpdate('fakeUserID');
        });
        it("Should try to set 4 guilds to update", function (done) {
            var count = 0;

            sandbox.stub(userService, "getGuilds", function (region, id, callback) {
                callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(updateModel, "upsert", function (type,region,realm,name,priority,callback){
                count ++;
                callback(new Error("Fake Error"));
                if(count == 4)
                    done();
            });

            userService.setGuildsToUpdate('fakeUserID');
        });
    });

    describe("userService.updateGuildsId",function() {
        it("Should set fakeUserID in 4 guilds", function (done) {
            var count = 0;
            sandbox.stub(userService, "getGuilds", function (region, id, callback) {
                callback(null,[{region:"fakeRegion",realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(guildService, "setId", function (region,realm,name,id,callback) {
                count ++;
                callback(null);
                if(count == 4)
                    done();
            });
            userService.updateGuildsId('fakeUserID');
        });
        it("Should set id to 3 guilds", function (done) {
            var count = 0;

            sandbox.stub(userService, "getGuilds", function (region, id, callback) {
                if(region == applicationStorage.config.bnetRegions[1])
                    callback(new Error("Fake Error"));
                else
                    callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(guildService, "setId", function (region,realm,name,id,callback) {
                count ++;
                callback();
                if(count == 3)
                    done();
            });

            userService.updateGuildsId('fakeUserID');
        });
        it("Should try to set id in 8 guilds", function (done) {
            var count = 0;
            sandbox.stub(userService, "getGuilds", function (region, id, callback) {
                callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"},{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(guildService, "setId", function (region,realm,name,id,callback) {
                count ++;
                callback(new Error("Fake Error"));
                if(count == 8)
                    done();
            });
            userService.updateGuildsId('fakeUserID');
        });

    });
    describe("userService.updateCharactersId",function() {
        it("Should set fakeUserID in 4 characters", function (done) {
            var count = 0;
            sandbox.stub(userService, "getCharacters", function (region, id, callback) {
                callback(null,[{region:"fakeRegion",realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(characterService, "setId", function (region,realm,name,id,callback) {
                count ++;
                callback(null);
                if(count == 4)
                    done();
            });
            userService.updateCharactersId('fakeUserID');
        });
        it("Should set id to 3 characters", function (done) {
            var count = 0;

            sandbox.stub(userService, "getCharacters", function (region, id, callback) {
                if(region == applicationStorage.config.bnetRegions[1])
                    callback(new Error("Fake Error"));
                else
                    callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(characterService, "setId", function (region,realm,name,id,callback) {
                count ++;
                callback();
                if(count == 3)
                    done();
            });

            userService.updateCharactersId('fakeUserID');
        });
        it("Should try to set id in 8 characters", function (done) {
            var count = 0;
            sandbox.stub(userService, "getCharacters", function (region, id, callback) {
                callback(null,[{region:region,realm:"fakeRealm",name:"fakeName"},{region:region,realm:"fakeRealm",name:"fakeName"}]);
            });
            sandbox.stub(characterService, "setId", function (region,realm,name,id,callback) {
                count ++;
                callback(new Error("Fake Error"));
                if(count == 8)
                    done();
            });
            userService.updateCharactersId('fakeUserID');
        });
    });
    describe("userService.getGuilds",function() {
        it("Should return two guilds", function (done) {
            sandbox.stub(userService, "getCharacters", function (region, id, callback) {
                callback(null,[{region:region,guildRealm:"fakeGuildRealm",guild:"fakeGuild"},{region:region,guildRealm:"fakeGuildRealm2",guild:"fakeGuild2"}]);
            });
            userService.getGuilds('fakeRegion','fakeUserID', function (error,guilds) {
                assert.equal(guilds.length,2);
                assert.equal(guilds[0].region, "fakeRegion");
                assert.equal(guilds[1].region, "fakeRegion");
                assert.equal(guilds[0].realm, "fakeGuildRealm");
                assert.equal(guilds[1].realm, "fakeGuildRealm2");
                assert.equal(guilds[0].name, "fakeGuild");
                assert.equal(guilds[1].name, "fakeGuild2");
                assert.isNull(error);
                done();
            });
        });
        it("Should return an error from userService.getCharacters", function (done) {
            sandbox.stub(userService, "getCharacters", function (region, id, callback) {
                callback(new Error("Fake Error"));
            });
            userService.getGuilds('fakeRegion','fakeUserID', function (error,guilds) {
                assert.isNotNull(error);
                assert.isUndefined(guilds);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });

    describe("userService.getCharacters",function() {
        it("Should return a character", function (done) {
            sandbox.stub(userModel, "findOne", function (criteria, callback) {
                callback(null,{id:1,battleTag:"test#1234",accessToken:"123456789"});
            });
            sandbox.stub(bnetAPI, "getUserCharacters", function (region, id, callback) {
                callback(null,[{region:region, realm:"fakeRealm", name:"fakeName", guildRealm:"fakeGuildRealm",guild:"fakeGuild"}]);
            });
            userService.getCharacters('fakeRegion','fakeUserID', function (error,characters) {
                assert.equal(characters.length,1);
                assert.equal(characters[0].region, "fakeRegion");
                assert.equal(characters[0].realm, "fakeRealm");
                assert.equal(characters[0].name, "fakeName");
                assert.equal(characters[0].guildRealm, "fakeGuildRealm");
                assert.equal(characters[0].guild, "fakeGuild");
                assert.isNull(error);
                done();
            });
        });
        it("Should return an error from userModel.findOne", function (done) {
            sandbox.stub(userModel, "findOne", function (criteria, callback) {
                callback(new Error("Fake Error"));
            });
            sandbox.stub(bnetAPI, "getUserCharacters", function (region, id, callback) {
                callback(null,[{region:region, realm:"fakeRealm", name:"fakeName", guildRealm:"fakeGuildRealm",guild:"fakeGuild"}]);
            });
            userService.getCharacters('fakeRegion','fakeUserID', function (error) {
                assert.isNotNull(error);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
        it("Should return an error from bnetAPI.getCharacters", function (done) {
            sandbox.stub(userModel, "findOne", function (criteria, callback) {
                callback(null,{id:1,battleTag:"test#1234",accessToken:"123456789"});
            });
            sandbox.stub(bnetAPI, "getUserCharacters", function (region, id, callback) {
                callback(new Error("Fake Error"));
            });
            userService.getCharacters('fakeRegion','fakeUserID', function (error) {
                assert.isNotNull(error);
                assert.equal(error.message,"Fake Error");
                done();
            });
        });
    });
});
