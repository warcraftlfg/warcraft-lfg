angular
    .module('app.filter')
    .directive('wlfgFilterRealmZone', wlfgFilterRealmZone);

wlfgFilterRealmZone.$inject = ['$translate', '$stateParams', '$location', 'socket'];
function wlfgFilterRealmZone($translate, $stateParams, $location, socket) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realmZone.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.realmZones = [
            {name: 'US', msGroup: true},
            {name:$translate.instant("US--EN_US--AMERICA--CHICAGO::LOS_ANGELES::NEW_YORK::DENVER") ,region:"us", locale:"en_US", zone:"America", cities:["Chicago","Los_Angeles","New_York","Denver"], selected:false},
            {name:$translate.instant("US--EN_US--AUSTRALIA--MELBOURNE"), region:"us", locale:"en_US", zone:"Australia", cities:["Melbourne"], selected:false},
            {name:$translate.instant("US--ES_MX--AMERICA--CHICAGO"), region:"us",  locale:"es_MX", zone:"America", cities:["Chicago"], selected:false},
            {name:$translate.instant("US--PT_BR--AMERICA--SAO_PAULO"), region:"us", locale:"pt_BR", zone:"America", cities:["Sao_Paulo"], selected:false},
            { msGroup: false},
            {name: 'EU', msGroup: true},
            {name:$translate.instant("EU--EN_GB--EUROPE--PARIS"), region:"eu", locale:"en_GB", zone:"Europe", cities:["Paris"], selected:false},
            {name:$translate.instant("EU--DE_DE--EUROPE--PARIS"), region:"eu", locale:"de_DE", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--FR_FR--EUROPE--PARIS"), region:"eu", locale:"fr_FR", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--ES_ES--EUROPE--PARIS"), region:"eu", locale:"es_ES", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--RU_RU--EUROPE--PARIS"), region:"eu", locale:"ru_RU", zone:"Europe", cities:["Paris"],selected:false},
            {name:$translate.instant("EU--PT_BR--EUROPE--PARIS"), region:"eu", locale:"pt_BR", zone:"Europe", cities:["Paris"],selected:false},
            { msGroup: false},
            {name:$translate.instant("TW--ZH_TW--ASIA--TAIPEI"), region:"tw", locale:"zh_TW", zone:"Asia", cities:["Taipei"], selected:false},
            {name:$translate.instant("KR--KO_KR--ASIA--SEOUL"), region:"kr", locale:"ko_KR", zone:"Asia", cities:["Seoul"], selected:false}
        ];

        $scope.localRealmZones = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_REALMZONES")
        };

        $scope.filters.realmZones = [];

        $scope.filters.states.realmZones = true;

        /* if params load filters */
        if ($stateParams.realm_zones) {
            var realmZones = $stateParams.realm_zones.split('__');
            angular.forEach($scope.realmZones,function(realmZone){

                angular.forEach(realmZones,function(realmZoneStr){
                    var params = realmZoneStr.split('--');
                    if (params.length == 4) {
                        var realmZoneTmp = {};
                        realmZoneTmp.region = params[0];
                        realmZoneTmp.locale = params[1];
                        realmZoneTmp.zone = params[2];
                        realmZoneTmp.cities = params[3].split('::');
                        if(realmZone.region == realmZoneTmp.region && realmZone.locale == realmZoneTmp.locale && realmZone.zone == realmZoneTmp.zone && angular.equals(realmZone.cities,realmZoneTmp.cities)) {
                            $scope.filters.realmZones.push(realmZoneTmp);
                            realmZone.selected = true;
                        }
                    }
                });
            });
        }

        socket.emit('get:realms', $scope.filters.realmZones);

        $scope.$watch('filters.realmZones',function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var realmZones = [];
            var realmInRegion = false;

            angular.forEach($scope.filters.realmZones,function(realmZone){

                if(realmZone.region == $scope.filters.realm_region) {
                    realmInRegion = true;
                }

                realmZones.push(realmZone.region +'--'+realmZone.locale+"--"+realmZone.zone+"--"+realmZone.cities.join('::'));

            });

            if (!realmInRegion && $scope.filters.realmZones.length > 0) {
                $stateParams.realm_region = null;
                $stateParams.realm_name = null;
            }

            if (realmZones.length > 0) {
                $location.search('realm_zones', realmZones.join('__'));
            } else {
                $location.search('realm_zones', null);
            }

            // We can do better ...
            $scope.filters.realm = {};
            $location.search('realm_name', null);
            $location.search('realm_region', null);

            socket.emit('get:realms', $scope.filters.realmZones);
            //socket.emit('get:characterAds', $scope.filters, true);
        },true);

        $scope.resetRealmZones = function() {
            $scope.filters.realmZones = [];
            angular.forEach($scope.realmZones,function(realmZone) {
                realmZone.selected = false;
            });
            $stateParams.realm_region = null;
            $stateParams.realm_name = null;
        };
    }
}