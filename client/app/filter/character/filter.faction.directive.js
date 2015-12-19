angular
    .module('app.filter')
    .directive('wlfgFilterFaction', wlfgFilterFaction);

wlfgFilterFaction.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterFaction(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.faction.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.faction', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.faction) {
                $location.search('faction', $scope.filters.faction);
            } else {
                $location.search('faction', null);
            }

            socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}