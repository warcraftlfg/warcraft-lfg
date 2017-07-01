(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', SearchController)
    ;

    SearchController.$inject = ["$scope", "$state", "$stateParams", "search", "wlfgAppTitle"];
    function SearchController($scope, $state, $stateParams, search, wlfgAppTitle) {
        wlfgAppTitle.setTitle("Search");

        $scope.term = $stateParams.term;

        $scope.loading = true;

        search.get({
            "search": $scope.term
        }, function(guilds) {
            $scope.limit = Math.ceil(guilds.length / 3);
            $scope.guilds = guilds;
            $scope.loading = false;
            if (guilds.length <= 0) {
                $scope.noResult = true;
            }
        }, function(error) {
            $scope.loading = false;
            $scope.noResult = true;
        });

    }
})();