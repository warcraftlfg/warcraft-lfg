angular
    .module('app.filter')
    .directive('wlfgFilterTimezone', wlfgFilterTimezone);

wlfgFilterTimezone.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterTimezone(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.timezone.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.timezone', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.timzeone) {
                $location.search('timzeone', $scope.filters.timzeone);
            } else {
                $location.search('timzeone', null);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}