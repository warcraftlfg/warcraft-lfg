angular
    .module('app.filter')
    .directive('wlfgFilterIlevel', wlfgFilterIlevel);

wlfgFilterIlevel.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterIlevel(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.ilevel.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.ilevel.active', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.ilevel.active === false) {
                $location.search('ilevel_min', null);
                $location.search('ilevel_max', null);
                $location.search('ilevel_active', null);
            } else {
                $location.search('ilevel_active', true);
            }

            socket.emit('get:characterAds',$scope.filters, true);
        });

        $scope.$watch('filters.ilevel.min', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.ilevel.min) {
                $location.search('ilevel_min', $scope.filters.ilevel.min);
            } else {
                $location.search('ilevel_min', null);
            }

            socket.emit('get:characterAds',$scope.filters, true);
        });

        $scope.$watch('filters.ilevel.max', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.ilevel.max) {
                $location.search('ilevel_max', $scope.filters.ilevel.max);
            } else {
                $location.search('ilevel_max', null);
            }

            socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}