(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope','$translate','socket','wlfgAppTitle','profile'];

    function Core($scope,$translate,socket,wlfgAppTitle,profile) {
        $scope.wlfgAppTitle = wlfgAppTitle;

        $scope.setLanguage = function (key){
            $translate.use(key);
        };

        $scope.user = profile.get();

    }
})();