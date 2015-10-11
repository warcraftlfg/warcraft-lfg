"use strict"

angular.module("wow-guild-recruit")
    .controller('MainCtrl', ['$scope','$translate','socket',function ($scope,$translate,socket) {
        $scope.setLanguage = function (key){
            $translate.use(key);
        }
        $scope.user = undefined;
        socket.on('get:user', function(user) {
            $scope.user = user;
        });
    }])
    .controller('DashboardCtrl', ['$scope','socket',function ($scope,socket) {

    }])
    .controller('AccountCtrl', ['$scope','socket',function ($scope,socket) {

    }])
    .controller('GuildAddCtrl', ['$scope','socket',function ($scope,socket) {
        socket.emit('get:bnet-guilds');
        socket.on('get:bnet-guilds', function(guilds) {
           console.log(guilds)
        });
    }]);
