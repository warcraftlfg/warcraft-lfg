(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope', '$translate', 'wlfgAppTitle', 'user'];

    function Core($scope, $translate, wlfgAppTitle, user) {
        $scope.wlfgAppTitle = wlfgAppTitle;

        $scope.currentLanguage = $translate.use() ||
            $translate.preferredLanguage();

        $scope.setLanguage = function (key) {
            $translate.use(key);
            $scope.currentLanguage = key;
        };

        $scope.user = user.get({param: "profile"});

        $scope.$watch("user", function () {
            if ($scope.user.language && $scope.user.language !== "") {
                $scope.currentLanguage = $scope.user.language;
                $translate.use($scope.user.language);
            }
        }, true);


    }
})();