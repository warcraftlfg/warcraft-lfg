angular
    .module('app.filter')
    .directive('wlfgFilterFaction', wlfgFilterFaction);

wlfgFilterFaction.$inject = ['$stateParams', '$location'];
function wlfgFilterFaction($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.faction.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        if ($stateParams.faction) {
            $scope.filters.faction = $stateParams.faction;
            $scope.factionOut = $stateParams.faction;
            $scope.filters.states.faction = true;
        }

        $scope.filters.states.faction = true;

        $scope.$watch('factionOut', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.factionOut && $scope.factionOut!=="") {
                $location.search('faction', $scope.factionOut);
                $scope.filters.faction = $scope.factionOut;
            } else {
                $location.search('faction', null);
                $scope.filters.faction = null;
            }

            $scope.$parent.loading = true;
        });
    }
}