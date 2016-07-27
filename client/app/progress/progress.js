(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('ProgressController', Progress);

    Progress.$inject = ["$scope", "$stateParams", "$location", "wlfgAppTitle", "ranking"];
    function Progress($scope, $stateParams, $location, wlfgAppTitle, ranking) {
        wlfgAppTitle.setTitle("WarcraftProgress");
        $scope.filters = {tier:'18',realm_zones:""};
        $scope.filters.states = {};
        //Reset error message
        $scope.$parent.error = null;
        $scope.path = "pve/";
        if ($stateParams.region) {
            $scope.path += $stateParams.region + "/";
            $scope.filters.region = $stateParams.region;
        }
        if ($stateParams.realm) {
            $scope.path += $stateParams.realm + "/";
            $scope.filters.realm = $stateParams.realm;
        }


        $scope.$watch('filters', function () {
                getRankings();
        });

        $scope.page = ($stateParams.page > 0) ? parseInt($stateParams.page) : 1;


        function getRankings() {
            ranking.get({tier: $scope.filters.tier, limit: 19, start: ($scope.page - 1) * 20}, function (ranking) {
                if (ranking) {
                    $scope.ranking = ranking;
                    $scope.$parent.loading = false;
                } else {
                    $scope.noResult = true;
                    $scope.$parent.loading = false;

                }
            });
        }
    }
})();