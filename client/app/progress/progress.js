(function () {
    'use strict';

    angular
        .module('app.progress')
        .controller('ProgressController', Progress);

    Progress.$inject = ["$scope", "$state", "$stateParams", "$location", "$translate", "wlfgAppTitle", "ranking", "realms", "__env"];
    function Progress($scope, $state, $stateParams, $location, $translate, wlfgAppTitle, ranking, realms, __env) {
        wlfgAppTitle.setTitle("WarcraftProgress");

        $scope.rankingRegions = __env.rankingRegions;
        $scope.rankingSubregions = __env.rankingSubregions;
        
        $scope.filters = {tier:'18'};
        $scope.filters.states = {};

        $scope.realms = [];

        $scope.localRealms = {
            selectAll: $translate.instant("SELECT_ALL"),
            selectNone: $translate.instant("SELECT_NONE"),
            reset: $translate.instant("RESET"),
            search: $translate.instant("SEARCH"),
            nothingSelected: $translate.instant("ALL_REALMS")
        };

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


        $scope.$watch('filters', function() {
            if ($scope.filters.realm) {
                $state.go('progressRealm', {region: $scope.filters.region, realm: $scope.filters.realm},  {notify: false});
            } else if ($scope.filters.region) {
                $state.go('progressRegion', {region: $scope.filters.region}, {notify: false});
            } else {
                $state.go('progress', {}, {notify: false});
            }
            getRankings();
        }, true);

        $scope.page = (parseInt($stateParams.page) > 0) ? parseInt($stateParams.page) : 1;

        function getRankings() {
            var query;

            query = angular.copy($scope.filters);

            if ( __env.rankingRegions[query.region]) {
                query.region = __env.rankingRegions[query.region];
            } else {
                query.region = __env.rankingSubregions[query.region];
            }
            query.limit = 20;
            query.start =  ($scope.page - 1) * 20;
            ranking.get(query, function (ranking) {
                if (ranking) {
                    $scope.ranking = ranking;
                    $scope.$parent.loading = false;
                } else {
                    $scope.noResult = true;
                    $scope.$parent.loading = false;

                }
            });
        }

        /*$scope.$on('get:realms', function () {
            realms.query({realm_zone: $scope.filters.realm_zone}, function (realms) {
                $scope.realms = realms;
                var realmIsInRealmZone = false;
                angular.forEach(realms, function (realm) {
                    realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                    if ($stateParams.realm) {
                        var params = $stateParams.realm.split('.');
                        if (params.length == 2 && params[1] == realm.name && params[0] == realm.region) {
                            realm.selected = true;
                            realmIsInRealmZone = true;
                        }
                    }
                });

                if (!realmIsInRealmZone) {
                    $location.search('realm', null);
                    $scope.filters.realm = null;
                }
            });
        });*/
    }
})();