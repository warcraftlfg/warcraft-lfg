(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope','$translate','socket','wlfgAppTitle','user'];

    function Core($scope,$translate,socket,wlfgAppTitle,user) {
        $scope.wlfgAppTitle = wlfgAppTitle;

        $scope.setLanguage = function (key){
            $translate.use(key);
        };

        $scope.user = user.get({param1:"profile"});

    }
})();