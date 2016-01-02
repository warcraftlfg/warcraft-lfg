angular
    .module('app.filter')
    .directive('wlfgFilterRealm', wlfgFilterRealm);

wlfgFilterRealm.$inject = ['$translate', '$stateParams', '$location', 'socket','realms'];
function wlfgFilterRealm($translate, $stateParams, $location, socket,realms) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realm.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.realms = [];

        $scope.localRealms = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_REALMS")
        };

        $scope.filters.realm = {};

        if ($stateParams.realm_name && $stateParams.realm_region) {
            $scope.filters.realm.region = $stateParams.realm_region;
            $scope.filters.realm.name = $stateParams.realm_name;

            $scope.realms = [{
                label: $stateParams.realm_name + " (" + $stateParams.realm_region.toUpperCase() + ")",
                selected: true
            }];
        }

        $scope.filters.states.realm = true;

        $scope.$watch('filters.realm',function(){
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if($scope.filters.realm){
                $location.search('realm_name', $scope.filters.realm.name);
                $location.search('realm_region', $scope.filters.realm.region);
            }

            $scope.$parent.loading = true;
        },true);

        $scope.setRealm = function(data){
            $scope.filters.realm = data;
        };

        $scope.resetRealm = function(){
            $scope.filters.realm = {};
            angular.forEach($scope.realms,function(realm) {
                realm.selected = false;
            });
        };

        $scope.$on('get:realms', function() {

             realms.query({realmZones:$scope.filters.realmZones},function(realms){
                 $scope.realms = realms;
                 angular.forEach(realms,function (realm) {
                     realm.label = realm.name + " (" + realm.region.toUpperCase() + ")";
                     if ($stateParams.realm_name && $stateParams.realm_name == realm.name && $stateParams.realm_region && $stateParams.realm_region==realm.region) {
                         realm.selected = true;
                     }
                 });
             });



        });

    }
}