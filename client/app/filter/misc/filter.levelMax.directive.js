angular
    .module('app.filter')
    .directive('wlfgFilterLevelMax', wlfgFilterLevelMax);

wlfgFilterLevelMax.$inject = ['$stateParams', '$location'];
function wlfgFilterLevelMax($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/misc/filter.levelMax.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.level_max = true;
        $scope.filters.level_max = true;

        if ($stateParams.level_max) {
            $scope.level_max = $stateParams.level_max;
        }

        $scope.filters.states.levelMax = true;

        $scope.$watch('level_max', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.level_max === true) {
                $location.search('level_max', true);
                $scope.filters.level_max = true;
            } else {
                $location.search('level_max', null);
                $scope.filters.level_max = null;
            }

            $scope.$parent.loading = true;
        });
    }
}