(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('ProgressController', Progress);

    Progress.$inject = ["$scope", "$stateParams", "$location", "wlfgAppTitle", "ranking"];
    function Progress($scope, $stateParams, $location, wlfgAppTitle, ranking) {
        wlfgAppTitle.setTitle("WarcraftProgress");
        $scope.filters = {};

        //Reset error message
        $scope.$parent.error = null;
        $scope.path =  "pve/";
        if ($stateParams.region) {
            $scope.path += $stateParams.region+"/";
            $scope.filters.region = $stateParams.region;
        }
        if ($stateParams.realm) {
            $scope.path += $stateParams.realm+"/";
            $scope.filters.realm = $stateParams.realm;
        }

        $scope.page = ($stateParams.page > 0) ? parseInt($stateParams.page) : 1;
        
        ranking.get({limit:19, start: ($scope.page-1)*20}, function(ranking) {
            if (ranking) {
                $scope.ranking = ranking;
            } else {
                $scope.noResult = true;
            }
        });
    }
})();