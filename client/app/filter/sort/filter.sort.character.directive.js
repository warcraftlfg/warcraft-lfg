angular
    .module('app.filter')
    .directive('wlfgSortCharacter', wlfgSortCharacter);

wlfgSortCharacter.$inject = ['$stateParams', '$location'];
function wlfgSortCharacter($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/sort/filter.sort.character.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        if ($stateParams.sort) {
            $scope.filters.sort = $stateParams.sort;
            $scope.sortOut = $stateParams.sort;
        } else {
            $scope.filters.sort = "date";
            $scope.sortOut = "date";
        }

        $scope.filters.states.sort = true;

        $scope.$watch('sortOut', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            $location.search('sort', $scope.sortOut);
            $scope.filters.sort = $scope.sortOut;

            $scope.$parent.loading = true;
        });
    }
}