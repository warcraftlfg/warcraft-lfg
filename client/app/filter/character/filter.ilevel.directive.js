angular
    .module('app.filter')
    .directive('wlfgFilterIlevel', wlfgFilterIlevel);

wlfgFilterIlevel.$inject = ['$stateParams', '$location'];
function wlfgFilterIlevel($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.ilevel.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        if ($stateParams.ilevel_active) {
            $scope.filters.ilevel.active = $stateParams.ilevel_active==="true";
        }

        if($stateParams.ilevel_min) {
            $scope.filters.ilevel.min = $stateParams.ilevel_min;
        }

        if($stateParams.ilevel_max) {
            $scope.filters.ilevel.max = $stateParams.ilevel_max;
        }

        $scope.filters.states.ilevel = true;

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
        });
    }
}