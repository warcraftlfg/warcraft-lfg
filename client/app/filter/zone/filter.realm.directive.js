angular
    .module('app.filter')
    .directive('wlfgFilterRealm', wlfgFilterRealm);

wlfgFilterRealm.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterRealm(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/zone/filter.realm.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.realm',function(){
            if($scope.$parent.loading || $scope.loading)
                return;

            if($scope.filters.realm){
                $location.search('realm_name', $scope.filters.realm.name);
                $location.search('realm_region', $scope.filters.realm.region);
            }
            // socket.emit('get:characterAds', $scope.filters, true);
        },true);

        $scope.setRealm = function(data){
            $scope.filters.realm = data;
            //socket.emit('get:characterAds',$scope.filters, true);
        };

        $scope.resetRealm = function(){
            $scope.filters.realm = {};
        };
    }
}