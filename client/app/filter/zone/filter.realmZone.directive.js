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

                if($scope.filters.realm && realmZone.region == $scope.filters.realm.split(".")[0]) {
                    realmInRegion = true;
                }
                if(realmZone.selected) {
                    realmZones.push(realmZone.region + '.' + realmZone.locale + "." + realmZone.zone + "." + realmZone.city);
                    realmZonesFilter.push(realmZone.region + "." + realmZone.locale + "." + realmZone.zone + "/" + realmZone.city);
                }

            });
            $scope.filters.realm_zone = realmZonesFilter;

            if (!realmInRegion) {
                $location.search('realm', null);
                $scope.filters.realm = null;

            }

            if (realmZones.length > 0) {
                $location.search('realm_zone', realmZones);
            } else {
                $location.search('realm_zone', null);
            }


            $scope.$emit('get:realms');

            $scope.$parent.loading = true;
        },true);




        /*$scope.realmZones = [
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

         $scope.filters.realm_zone = [];

         $scope.filters.states.realmZones = true;

         if ($stateParams.realm_zone) {
         var realmZones = $stateParams.realm_zone;
         if(!angular.isArray(realmZones))
         realmZones = [realmZones];


         angular.forEach($scope.realmZones,function(realmZone){
         angular.forEach(realmZones,function(realmZoneStr){
         var params = realmZoneStr.split('.');

         if (params.length == 4) {
         var realmZoneTmp = {};
         realmZoneTmp.region = params[0];
         realmZoneTmp.locale = params[1];
         realmZoneTmp.zone = params[2];
         realmZoneTmp.cities = params[3].split('::');
         if(realmZone.region == realmZoneTmp.region && realmZone.locale == realmZoneTmp.locale && realmZone.zone == realmZoneTmp.zone && angular.equals(realmZone.cities,realmZoneTmp.cities)) {
         realmZone.cities.forEach(function(city){
         $scope.filters.realm_zone.push(realmZone.region+"."+realmZone.locale+"."+realmZone.zone+"/"+city);
         });

         realmZone.selected = true;
         }
         }
         });
         });
         }




         $timeout(function () {
         $scope.$emit('get:realms');
         });


         $scope.$watch('realmZonesOut',function() {

         if ($scope.$parent.loading || $scope.loading) {
         return;
         }

         var realmZones = [];
         var realmInRegion = false;
         var realmZonesFilter = [];

         angular.forEach($scope.realmZonesOut,function(realmZone){

         if(realmZone.region == $scope.filters.realm_region) {
         realmInRegion = true;
         }
         realmZones.push(realmZone.region +'.'+realmZone.locale+"."+realmZone.zone+"."+realmZone.cities.join('::'));
         realmZone.cities.forEach(function(city){
         realmZonesFilter.push(realmZone.region+"."+realmZone.locale+"."+realmZone.zone+"/"+city);
         });
         });
         $scope.filters.realm_zone = realmZonesFilter;

         if (!realmInRegion && $scope.realmZonesOut.length > 0) {
         $stateParams.realm_region = null;
         $stateParams.realm_name = null;
         }

         if (realmZones.length > 0) {
         $location.search('realm_zone', realmZones);
         } else {
         $location.search('realm_zone', null);
         }

         // We can do better ...
         $scope.filters.realm = null;
         $location.search('realm', null);

         $scope.$emit('get:realms');

         //$scope.$parent.loading = true;
         },true);

         $scope.resetRealmZones = function() {
         $scope.realmZoneOut = [];
         angular.forEach($scope.realmZones,function(realmZone) {
         realmZone.selected = false;
         });
         $stateParams.realm_region = null;
         $stateParams.realm_name = null;
         };*/
    }
}