angular
    .module('app.filter')
    .directive('wlfgFilterTimezone', wlfgFilterTimezone);

wlfgFilterTimezone.$inject = ['$stateParams', '$location', 'TIMEZONES'];
function wlfgFilterTimezone($stateParams, $location, TIMEZONES) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.timezone.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.timezones = TIMEZONES;

        if ($stateParams.timezone) {
            $scope.filters.timezone = $stateParams.timezone;
        }

        $scope.filters.states.timezone = true;

        $scope.$watch('filters.timezone', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.timzeone) {
                $location.search('timzeone', $scope.filters.timzeone);
            } else {
                $location.search('timzeone', null);
            }

            $scope.$parent.loading = true;
        });
    }
}