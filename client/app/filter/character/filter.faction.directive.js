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

        $scope.faction = {
            alliance: {selected: false},
            horde: {selected: false}
        };


        if ($stateParams.faction) {
            if ($stateParams.faction == '0') {
                $scope.faction.alliance.selected = true;
                $scope.filters.faction = 0;

            } else if ($stateParams.faction == '1') {
                $scope.faction.horde.selected = true;
                $scope.filters.faction = 1;
            }
        }

        $scope.filters.states.faction = true;

        $scope.$watch('faction', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.faction.alliance.selected === true && $scope.faction.horde.selected === false) {
                $location.search('faction', 0);
                $scope.filters.faction = 0;
            } else if ($scope.faction.alliance.selected === false && $scope.faction.horde.selected === true) {
                $location.search('faction', 1);
                $scope.filters.faction = 1;
            } else {
                $location.search('faction', null);
                $scope.filters.faction = null;
            }

            $scope.$parent.loading = true;
        },true);
    }
}