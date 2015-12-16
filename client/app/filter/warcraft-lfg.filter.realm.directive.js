angular
    .module('app.filter')
    .directive('wlfgFilterRealm', wlfgFilterRealm);

wlfgFilterRealm.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterRealm(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/warcraft-lfg.filter.realm.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.filters.realmZones = [];

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
                        if(realmZone.region == realmZoneTmp.region && realmZone.locale == realmZoneTmp.locale && realmZone.zone == realmZoneTmp.zone && angular.equals(realmZone.cities,realmZoneTmp.cities)){
                            $scope.filters.realmZones.push(realmZoneTmp);
                            realmZone.selected = true;
                        }
                    }
                });
            });
        }

        $scope.$watch('filters.realmZones',function(){
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var realmZones = [];
            var realmInRegion = false;

            angular.forEach($scope.filters.realmZones,function(realmZone){

                if(realmZone.region == $scope.filters.realm_region)
                    realmInRegion=true;

                realmZones.push(realmZone.region +'--'+realmZone.locale+"--"+realmZone.zone+"--"+realmZone.cities.join('::'));

            });

            if (!realmInRegion && $scope.filters.realmZones.length>0) {
                $stateParams.realm_region=null;
                $stateParams.realm_name=null;
            }

            if (realmZones.length > 0) {
                $location.search('realm_zones', realmZones.join('__'));
            } else {
                $location.search('realm_zones', null);
            }

            // We can do better ...
            $scope.filters.realm = null;
            $location.search('realm_name', null);
            $location.search('realm_region', null);

            console.log($scope.filters);

            socket.emit('get:characterAds', $scope.filters, true);
        });
    }
}