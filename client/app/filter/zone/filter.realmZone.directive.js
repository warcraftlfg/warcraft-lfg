angular
    .module('app.filter')
    .directive('wlfgFilterRealmZone', wlfgFilterRealmZone);

wlfgFilterRealmZone.$inject = ['$translate', '$stateParams', '$location', '$timeout'];
function wlfgFilterRealmZone($translate, $stateParams, $location, $timeout) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realmZone.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.realmZones = {
            en: {region: "eu", locale: "en_GB", zone: "Europe", city: "Paris", selected: false},
            fr: {region: "eu", locale: "fr_FR", zone: "Europe", city: "Paris", selected: false},
            de: {region: "eu", locale: "de_DE", zone: "Europe", city: "Paris", selected: false},
            es: {region: "eu", locale: "es_ES", zone: "Europe", city: "Paris", selected: false},
            ru: {region: "eu", locale: "ru_RU", zone: "Europe", city: "Paris", selected: false},
            it: {region: "eu", locale: "it_IT", zone: "Europe", city: "Paris", selected: false},
            pt: {region: "eu", locale: "pt_BR", zone: "Europe", city: "Paris", selected: false},
            ea: {region: "us", locale: "en_US", zone: "America", city: "New_York", selected: false},
            ce: {region: "us", locale: "en_US", zone: "America", city: "Chicago", selected: false},
            mo: {region: "us", locale: "en_US", zone: "America", city: "Denver", selected: false},
            pa: {region: "us", locale: "en_US", zone: "America", city: "Los_Angeles", selected: false},
            la: {region: "us", locale: "es_MX", zone: "America", city: "Chicago", selected: false},
            oc: {region: "us", locale: "en_US", zone: "Australia", city: "Melbourne", selected: false},
            br: {region: "us", locale: "pt_BR", zone: "America", city: "Sao_Paulo", selected: false},
            kr: {region: "kr", locale: "ko_KR", zone: "Asia", city: "Seoul", selected: false},
            tw: {region: "tw", locale: "zh_TW", zone: "Asia", city: "Taipei", selected: false}
        };

        $scope.filters.realm_zone = [];

        $scope.filters.states.realmZones = true;


        if ($stateParams.realm_zone) {
            var realmZones = $stateParams.realm_zone;
            if (!angular.isArray(realmZones)) {
                realmZones = [realmZones];
            }

            angular.forEach($scope.realmZones, function (realmZone) {
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

        $scope.$watch('realmZones',function() {

            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var realmZones = [];
            var realmInRegion = false;
            var realmZonesFilter = [];

            angular.forEach($scope.realmZones,function(realmZone){
                if(realmZone.selected) {
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
    }
}