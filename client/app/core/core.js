(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope','$translate','socket','wlfgAppTitle','User'];

    function Core($scope,$translate,socket,wlfgAppTitle,User) {
        $scope.wlfgAppTitle = wlfgAppTitle;

        $scope.setLanguage = function (key){
            $translate.use(key);
        };

        $scope.user = User.get();

    }
})();