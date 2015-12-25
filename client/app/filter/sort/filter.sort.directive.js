angular
    .module('app.filter')
    .directive('wlfgSort', wlfgSort);

wlfgSort.$inject = ['$stateParams', '$location'];
function wlfgSort($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/sort/filter.sort.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.filters.sort = "ilevel";

        if ($stateParams.sort) {
            $scope.filters.sort = $stateParams.sort;
        }

        $scope.filters.states.sort = true;

        $scope.$watch('filters.sort', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            $location.search('sort', $scope.filters.sort);
        });
    }
}