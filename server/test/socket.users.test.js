var socket = require("socket.io-client");
var assert = require("chai").assert;

var socketURL = 'https://127.0.0.1:3000';

var options ={
    'force new connection': true
};

describe("Socket.io Users",function() {
    it("Should broadcast {logged_in: false} to anonymous user", function (done) {
        var anonymousClient = socket.connect(socketURL,options);
        anonymousClient.on('get:user', function (user) {
            assert.equal(user.logged_in, false);
            done();
        });
    });

});
