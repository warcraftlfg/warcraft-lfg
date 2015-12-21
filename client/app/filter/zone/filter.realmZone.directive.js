angular
    .module('app.filter')
    .directive('wlfgFilterRealmZone', wlfgFilterRealmZone);

wlfgFilterRealmZone.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterRealmZone(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realmZone.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
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

            //socket.emit('get:characterAds', $scope.filters, true);
        },true);

        $scope.resetRealmZones = function(){
            $scope.filters.realmZones = [];
        };
    }
}