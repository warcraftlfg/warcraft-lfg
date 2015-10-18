(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('InitializeController', Initialize);

    Initialize.$inject = ['$scope','$translate','socket'];

    function Initialize($scope,$translate,socket) {
        $scope.setLanguage = function (key){
            $translate.use(key);
        }

        $scope.user = undefined;
        
        socket.on('get:user', function(user) {
            $scope.user = user;
        });

        socket.on('global:error', function(error) {
            $scope.error = error;
            $scope.loading=false;
        });
    }
})();