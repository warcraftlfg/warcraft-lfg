(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavbarController', Navbar);

    Navbar.$inject = ['$scope', '__env'];
    function Navbar($scope, __env) {
        $scope.warcraftLfgUrl = __env.warcraftLfgUrl;
        $scope.warcraftProgressUrl = __env.warcraftProgressUrl;
        $scope.warcraftParserUrl = __env.warcraftParserUrl;
        $scope.apiUrl = __env.apiUrl;
        if (__env.html5) {
            $scope.hashbang = '';
            $scope.hashbangAbs = '';
        } else {
            $scope.hashbang = '#';
            $scope.hashbangAbs = '#/';
        }
    }
})();