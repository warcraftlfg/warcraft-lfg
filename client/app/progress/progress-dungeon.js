(function () {
    'use strict';

    angular
        .module('app.progress')
        .controller('ProgressDungeonController', ProgressDungeon);

    ProgressDungeon.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "$location", "$translate", "$timeout", "wlfgAppTitle", "dungeon", "realms", "__env"];
    function ProgressDungeon($rootScope, $scope, $state, $stateParams, $location, $translate, $timeout, wlfgAppTitle, dungeon, realms, __env) {
        wlfgAppTitle.setTitle("WarcraftProgress");

        $scope.$parent.error = null;
        $scope.$parent.loading = true;
        $scope.rankingRegions = __env.rankingRegions;
        $scope.rankingSubregions = __env.rankingSubregions;
        $scope.filters = {};
        $scope.filters.states = {};
        $scope.filters.realm = null;
        $scope.realms = [];
        $scope.rankings = [];
        $scope.stats = [];
        $scope.noResults = [];
        $scope.limit = 20;
        var initialLoading = false;
        var initialLoadingPage = false;
        var realmSetRegion = false;

        $scope.raids = [];
        angular.forEach(__env.tiers.current, function(value, key) {
            $scope.raids.push(__env.tiers[value]);
        });

        $scope.localRealms = {
            selectAll: $translate.instant("SELECT_ALL"),
            selectNone: $translate.instant("SELECT_NONE"),
            reset: $translate.instant("RESET"),
            search: $translate.instant("SEARCH"),
            nothingSelected: $translate.instant("ALL_REALMS")
        };

        $rootScope.$on('$translateChangeSuccess', function () {
            $scope.localRealms = {
                selectAll: $translate.instant("SELECT_ALL"),
                selectNone: $translate.instant("SELECT_NONE"),
                reset: $translate.instant("RESET"),
                search: $translate.instant("SEARCH"),
                nothingSelected: $translate.instant("ALL_REALMS")
            };
        });

        //Reset error message
        $scope.$parent.error = null;
        $scope.path = "dungeon/";
        if ($stateParams.region) {
            if ($stateParams.realm) {
                realmSetRegion = true;
            }
            $scope.path += $stateParams.region + "/";
            $scope.filters.region = $stateParams.region;
        }
        if ($stateParams.realm) {
            $scope.path += $stateParams.realm + "/";
            $scope.filters.realm = $stateParams.realm;
        }

        $scope.page = (parseInt($stateParams.page) > 0) ? parseInt($stateParams.page) : 1;
        $scope.lastPage = $scope.page;

        $scope.$watch('filters.region', function () {
            if (!realmSetRegion) {
                $scope.filters.realm = null;
                angular.forEach($scope.realms, function (realm) {
                    realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                    realm.selected = false;
                });
            }
            realmSetRegion = false;
            $timeout(function () {
                $scope.$emit('get:realms');
            });
        });

        $scope.$watch('filters', function () {
            if (initialLoading) {
                if ($scope.page > 1) {
                    $scope.page = 1;
                    initialLoadingPage = false;
                }

                if ($scope.filters.realm && $scope.filters.region == $scope.realmRegion) {
                    $scope.path = "dungeon/" + $scope.filters.region + "/" + $scope.filters.realm + "/";
                    $state.go('progressDungeonRealm', {
                        region: $scope.filters.region,
                        realm: $scope.filters.realm,
                        page: null,
                        dungeon: $scope.filters.dungeon,
                        affixes: $scope.filters.affixes
                    }, {notify: false});
                } else if ($scope.filters.region) {
                    $scope.path = "dungeon/" + $scope.filters.region + "/";
                    $state.go('progressDungeonRegion', {
                        region: $scope.filters.region,
                        page: null,
                        dungeon: $scope.filters.dungeon,
                        affixes: $scope.filters.affixes
                    }, {notify: false});
                } else {
                    $scope.path = "dungeon/";
                    $state.go('progressDungeon', {
                        page: null,
                        dungeon: $scope.filters.dungeon,
                        affixes: $scope.filters.affixes
                    }, {notify: false});
                }

                /*if ($scope.filters.dungeon !== "") {
                    $location.search('dungeon', $scope.filters.dungeon);
                } else {
                    $location.search('dungeon', null);
                }

                if ($scope.filters.affixes !== "") {
                    $location.search('affixes', $scope.filters.affixes);
                } else {
                    $location.search('affixes', null);
                }*/

            }

            $scope.ranking = [];
            getRankings();

            initialLoading = true;
        }, true);

        $scope.$watch('page', function () {
            if ($scope.page >= 1) {
                if (initialLoadingPage) {
                    if ($scope.page != $scope.lastPage) {
                        if ($scope.filters.realm && $scope.filters.region == $scope.realmRegion) {
                            $scope.path = "dungeon/" + $scope.filters.region + "/" + $scope.filters.realm + "/";
                            $state.go('progressDungeonRealm', {
                                region: $scope.filters.region,
                                realm: $scope.filters.realm,
                                page: $scope.page
                            }, {notify: false});
                        } else if ($scope.filters.region) {
                            $scope.path = "dungeon/" + $scope.filters.region + "/";
                            $state.go('progressDungeonRegion', {region: $scope.filters.region, page: $scope.page}, {notify: false});
                        } else {
                            $scope.path = "dungeon/";
                            $state.go('progressDungeon', {page: $scope.page}, {notify: false});
                        }
                        $scope.lastPage = $scope.page;
                    }

                    $scope.ranking = [];
                    getRankings();
                }
            }

            initialLoadingPage = true;
        });

        $scope.$parent.loading = false;

        function getRankings() {
            $scope.loading = true;
            $scope.rankings = [];
            var query;

            query = angular.copy($scope.filters);

            if (__env.rankingRegions[query.region]) {
                query.region = __env.rankingRegions[query.region];
            } else {
                query.region = __env.rankingSubregions[query.region];
            }
            query.limit = $scope.limit;
            query.page = $scope.page;

            $scope.noResults = false;
            dungeon.get(query, function (ranking) {
                if (ranking) {
                    $scope.rankings = ranking;
                    if (Object.keys(ranking).length <= 2) {
                        $scope.noResults = true;
                    }
                }
                $scope.loading = false;
            }, function(error) {

                $scope.loading = false;
                $scope.noResults = true;
            });
        }

        $scope.goToRealm = function(region, realm) {
            if (realm) {
                $scope.setRealm({region: region.toLowerCase(), name: realm});
            } else {
               $scope.filters.region = region; 
            }
        };

        /* Realm stuff */
        $scope.setRealm = function (data) {
            if (data.region != $scope.filters.region) {
                realmSetRegion = true;
            }
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

        $scope.backPage = function() {
            if ($scope.page > 1) {
                $scope.page--;
            }
        };

        $scope.nextPage = function() {
            $scope.page++;
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