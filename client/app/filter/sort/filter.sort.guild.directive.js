angular
    .module('app.filter')
    .directive('wlfgSortGuild', wlfgSortGuild);

wlfgSortGuild.$inject = ['$stateParams', '$location'];
function wlfgSortGuild($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/sort/filter.sort.guild.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.filters.sort = "date";

        if ($stateParams.sort) {
            $scope.filters.sort = $stateParams.sort;
        }

        $scope.filters.states.sort = true;

        $scope.$watch('filters.sort', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            $location.search('sort', $scope.filters.sort);

            $scope.$parent.loading = true;
        });
    }
}