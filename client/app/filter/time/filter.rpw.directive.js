angular
    .module('app.filter')
    .directive('wlfgFilterRpw', wlfgFilterRpw);

wlfgFilterRpw.$inject = ['$stateParams', '$location'];
function wlfgFilterRpw($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.rpw.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.filters.raids_per_week = {active:false,min:1,max:7};

        if ($stateParams.raids_per_week_active) {
            $scope.filters.raids_per_week.active = $stateParams.raids_per_week_active==="true";
        }

        if ($stateParams.raids_per_week_min) {
            $scope.filters.raids_per_week.min = $stateParams.raids_per_week_min;
        }

        if ($stateParams.raids_per_week_max) {
            $scope.filters.raids_per_week.max = $stateParams.raids_per_week_max;
        }

        $scope.filters.states.rpw = true;

        $scope.$watch('filters.raids_per_week.active', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.raids_per_week.active === false) {
                $location.search('raids_per_week_min', null);
                $location.search('raids_per_week_max', null);
                $location.search('raids_per_week_active', null);
            } else {
                $location.search('raids_per_week_active', true);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        });

        $scope.$watch('filters.raids_per_week.min', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.raids_per_week.min) {
                $location.search('raids_per_week_min', $scope.filters.raids_per_week.min);
            } else {
                $location.search('raids_per_week_min', null);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        });

        $scope.$watch('filters.raids_per_week.max', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.raids_per_week.max) {
                $location.search('raids_per_week_max', $scope.filters.raids_per_week.max);
            } else {
                $location.search('raids_per_week_max', null);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}