(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('CoreController', Core);

    Core.$inject = ['$scope', '$translate', 'socket', 'wlfgAppTitle', 'user', 'amMoment'];

    function Core($scope, $translate, socket, wlfgAppTitle, user, amMoment) {
        $scope.wlfgAppTitle = wlfgAppTitle;

        $scope.currentLanguage = $translate.use() ||
            $translate.preferredLanguage();

        amMoment.changeLocale($translate.use() || $translate.preferredLanguage());

        $scope.setLanguage = function (key) {
            $translate.use(key);
            $scope.currentLanguage = $translate.use();
            amMoment.changeLocale(key);
        };

        $scope.user = user.get({param: "profile"});

    }
})();