var assert = require("chai").assert;
var sinon = require("sinon");

var guildSort = process.require("guilds/utilities/mongo/guildSort.js");
var applicationStorage = process.require("core/applicationStorage.js");


describe("guildSort",function() {

    it("Should return ranking sort", function (done) {

        var query = {sort:"ranking"};
        var sort = guildSort.get(query);

        assert.deepEqual(sort,{"_id":-1,"wowProgress.world_rank":1});
        done();
    });
    it("Should return progress sort", function (done) {

        var config = applicationStorage.config;
        var raid = config.progress.raids[0];
        var query = {sort:"progress"};
        var sort = guildSort.get(query);
        var tmp = {};
        tmp["progress."+raid.name+".score"]= -1;
        tmp._id = -1;
        assert.deepEqual(sort,tmp);
        done();
    });
    it("Should return date sort", function (done) {

        var query = {sort:"date"};
        var sort = guildSort.get(query);

        assert.deepEqual(sort,{"_id":-1,"ad.updated":-1});
        done();
    });
    it("Should return default date sort", function (done) {

        var query = {fakeKey:"fakeValue"};
        var sort = guildSort.get(query);

        assert.deepEqual(sort,{"_id":-1,"ad.updated":-1});
        done();
    });
    it("Should return default date sort", function (done) {

        var query = {sort:"fakeValue.fakeValue"};
        var sort = guildSort.get(query);

        assert.deepEqual(sort,{"_id":-1,"ad.updated":-1});
        done();
    });

});

