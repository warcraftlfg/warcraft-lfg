angular
    .module('app.filter')
    .directive('wlfgFilterFaction2', wlfgFilterFaction2);

wlfgFilterFaction2.$inject = ['$stateParams', '$location'];
function wlfgFilterFaction2($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.faction2.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.faction2 = "";


        if ($stateParams.faction) {
            if ($stateParams.faction == '0') {
                $scope.faction2 = '0';
                $scope.filters.faction = 0;

            } else if ($stateParams.faction == '1') {
                $scope.faction2 = '1';
                $scope.filters.faction = 1;
            }
        }

        $scope.filters.states.faction = true;

        $scope.$watch('faction2', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.faction2 == '0') {
                $location.search('faction', 0);
                $scope.filters.faction = 0;
            } else if ($scope.faction2 == '1') {
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