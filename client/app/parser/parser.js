(function () {
    'use strict';

    angular
        .module('app.parser')
        .controller('ParserDashboardController', ParserDashboardController);

    ParserDashboardController.$inject = ["$scope", "$stateParams", "$location", "wlfgAppTitle"];
    function ParserDashboardController($scope, $stateParams, $location, wlfgAppTitle) {
        wlfgAppTitle.setTitle("WarcraftParser");
    }
})();