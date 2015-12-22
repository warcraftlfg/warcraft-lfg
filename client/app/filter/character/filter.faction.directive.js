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
        $scope.filters.states.faction = false;

        if ($stateParams.faction) {
            $scope.filters.faction = $stateParams.faction;
            $scope.filters.states.faction = true;
        }
        else {
            $scope.filters.states.faction = true;
        }


        $scope.$watch('filters.faction', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.faction) {
                $location.search('faction', $scope.filters.faction);
            } else {
                $location.search('faction', null);
            }
        });
    }
}