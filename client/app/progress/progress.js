(function () {
    'use strict';

    angular
        .module('app.progress')
        .controller('ProgressController', Progress);

    Progress.$inject = ["$scope", "$state", "$stateParams", "$location", "$translate", "$timeout", "wlfgAppTitle", "ranking", "realms", "__env"];
    function Progress($scope, $state, $stateParams, $location, $translate, $timeout, wlfgAppTitle, ranking, realms, __env) {
        wlfgAppTitle.setTitle("WarcraftProgress");

        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.rankingRegions = __env.rankingRegions;
        $scope.rankingSubregions = __env.rankingSubregions;
        $scope.filters = {tier:'18'};
        $scope.filters.states = {};
        $scope.realms = [];
        var initialLoading = false;

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

        $scope.page = (parseInt($stateParams.page) > 0) ? parseInt($stateParams.page) : 1;

        $scope.$watch('filters.region', function() {
            $timeout(function () {
                $scope.$emit('get:realms');
            });
        });

        $scope.$watch('filters', function() {
            if (initialLoading) {
                $scope.page = 1;

                if ($scope.filters.realm && $scope.filters.region == $scope.realmRegion) {
                    $scope.path = "pve/"+$scope.filters.region + "/"+ $scope.filters.realm+"/";
                    $state.go('progressRealm', {region: $scope.filters.region, realm: $scope.filters.realm, page: null});
                } else if ($scope.filters.region) {
                    $scope.path = "pve/"+$scope.filters.region + "/";
                    $state.go('progressRegion', {region: $scope.filters.region, page: null});
                } else {
                    $scope.path = "pve/";
                    $state.go('progress', {page: null});
                }
            }

            $scope.ranking = [];
            getRankings();

            initialLoading = true;
        }, true);

        $scope.$parent.loading = false;

        function getRankings() {
            $scope.loading = true;
            var query;
            
            query = angular.copy($scope.filters);

            if ( __env.rankingRegions[query.region]) {
                query.region = __env.rankingRegions[query.region];
            } else {
                query.region = __env.rankingSubregions[query.region];
            }
            query.limit = 20;
            query.start =  ($scope.page - 1) * 20;
            $scope.noResult = false;
            ranking.get(query, function (ranking) {
                if (ranking) {
                    $scope.ranking = ranking;
                    if (Object.keys(ranking).length <= 2) {
                        $scope.noResult = true;
                    }
                }
                $scope.loading = false;
            });
        }

        /* Realm stuff */
        $scope.setRealm = function (data) {
            $scope.filters.region = data.region;
            $scope.realmRegion = data.region;
            $scope.filters.realm = data.name;
            //$scope.realmOut = data;
        };

        $scope.resetRealm = function () {
            $scope.filters.realm = null;
            angular.forEach($scope.realms, function (realm) {
                realm.selected = false;
            });
        };

        $scope.$on('get:realms', function () {
            var realm_zone = "";
            if ($scope.filters.region && __env.realms[$scope.filters.region]) {
                    realm_zone = __env.realms[$scope.filters.region];
            }
            realms.query({realm_zone: realm_zone}, function (realms) {
                $scope.realms = realms;
                var realmIsInRealmZone = false;
                angular.forEach(realms, function (realm) {
                    realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                    if ($stateParams.realm == realm.name || $scope.filters.realm == realm.name) {
                        realm.selected = true;
                        $scope.realmRegion = realm.region;
                    }
                });
            });
        });
    }
})();