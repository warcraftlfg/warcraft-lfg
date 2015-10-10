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

    }]);