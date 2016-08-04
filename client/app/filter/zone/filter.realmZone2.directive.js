angular
    .module('app.filter')
    .directive('wlfgFilterRealmZone2', wlfgFilterRealmZone2);

wlfgFilterRealmZone2.$inject = ['$translate', '$stateParams', '$location', '$timeout'];
function wlfgFilterRealmZone2($translate, $stateParams, $location, $timeout) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realmZone2.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.realmZones = [];

        $scope.realmZones2 = [
            {name: 'EU', msGroup: true},
            { name: $translate.instant("ENGLISH"), region: "eu", locale: "en_GB", zone: "Europe", city: "Paris",selected: false },
            { name: $translate.instant("GERMAN"), region: "eu", locale: "de_DE", zone: "Europe", city: "Paris", selected: false },
            { name: $translate.instant("FRENCH"), region: "eu", locale: "fr_FR", zone: "Europe", city: "Paris", selected: false },
            { name: $translate.instant("SPANISH"), region: "eu", locale: "es_ES", zone: "Europe", city: "Paris", selected: false },
            { name: $translate.instant("RUSSIAN"), region: "eu", locale: "ru_RU", zone: "Europe", city: "Paris", selected: false },
            { name: $translate.instant("ITALIAN"), region: "eu", locale: "it_IT", zone: "Europe", city: "Paris", selected: false },
            { name: $translate.instant("PORTUGUESE"), region: "eu", locale: "pt_BR", zone: "Europe", city: "Paris", selected: false },
            {msGroup: false},
            {name: 'US', msGroup: true},
            { name: $translate.instant("OCEANIC"), region: "us", locale: "en_US", zone: "Australia", city: "Melbourne", selected: false },
            { name: $translate.instant("LATIN_AMERICA"), region: "us", locale: "es_MX", zone: "America", city: "Chicago", selected: false },
            { name: $translate.instant("BRAZIL"), region: "us", locale: "pt_BR", zone: "America", city: "Sao_Paulo", selected: false },
            {name: 'USA', msGroup: true},
            { name: $translate.instant("USA_PACIFIC"), region: "us", locale: "en_US", zone: "America", city: "Los_Angeles", selected: false },
            { name: $translate.instant("USA_MOUNTAIN"), region: "us", locale: "en_US", zone: "America", city: "Denver", selected: false },
            { name: $translate.instant("USA_CENTRAL"), region: "us", locale: "en_US", zone: "America", city: "Chicago", selected: false },
            { name: $translate.instant("USA_EASTERN"), region: "us", locale: "en_US", zone: "America", city: "New_York", selected: false },
            {msGroup: false},
            {msGroup: false},
            { name: $translate.instant("TAIWANESE"), region: "tw", locale: "zh_TW", zone: "Asia", city: "Taipei", selected: false },
            { name: $translate.instant("KOREAN"), region: "kr", locale: "ko_KR", zone: "Asia", city: "Seoul", selected: false }
        ];

        $scope.localRealmZones = {
            selectAll: $translate.instant("SELECT_ALL"),
            selectNone: $translate.instant("SELECT_NONE"),
            reset: $translate.instant("RESET"),
            search: $translate.instant("SEARCH"),
            nothingSelected: $translate.instant("ALL_REALMZONES")
        };

        $scope.filters.realm_zone = [];

        $scope.filters.states.realmZones = true;


        if ($stateParams.realm_zone) {
            var realmZones = $stateParams.realm_zone;
            if (!angular.isArray(realmZones)) {
                realmZones = [realmZones];
            }

            angular.forEach($scope.realmZones2, function (realmZone) {
                angular.forEach(realmZones, function (realmZoneStr) {
                    var params = realmZoneStr.split('.');
                    if (params.length == 4) {
                        var realmZoneTmp = {};
                        realmZoneTmp.region = params[0];
                        realmZoneTmp.locale = params[1];
                        realmZoneTmp.zone = params[2];
                        realmZoneTmp.city = params[3];
                        if (realmZone.region == realmZoneTmp.region && realmZone.locale == realmZoneTmp.locale && realmZone.zone == realmZoneTmp.zone && realmZone.city == realmZoneTmp.city) {
                            $scope.filters.realm_zone.push(realmZone.region + "." + realmZone.locale + "." + realmZone.zone + "/" + realmZone.city);
                            realmZone.selected = true;
                        }
                    }
                });
            });
        }

        $timeout(function () {
            $scope.$emit('get:realms');
        });

        $scope.$watch('realmZones2Out',function() {

            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var realmZones = [];
            var realmInRegion = false;
            var realmZonesFilter = [];

            angular.forEach($scope.realmZones2Out, function(realmZone) {
                if (realmZone.selected) {
                    realmZones.push(realmZone.region + '.' + realmZone.locale + "." + realmZone.zone + "." + realmZone.city);
                    realmZonesFilter.push(realmZone.region + "." + realmZone.locale + "." + realmZone.zone + "/" + realmZone.city);
                }
            });
            $scope.filters.realm_zone = realmZonesFilter;

            if (realmZones.length > 0) {
                $location.search('realm_zone', realmZones);
            } else {
                $location.search('realm_zone', null);
            }


            $scope.$emit('get:realms');

            $scope.$parent.loading = true;
        },true);

        $scope.resetRealmZones = function(){
            $scope.realmZones2Out = null;
            angular.forEach($scope.realmZones2 ,function(realmZone) {
                realmZone.selected = false;
            });
        };
    }
}