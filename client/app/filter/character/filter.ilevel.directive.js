angular
    .module('app.filter')
    .directive('wlfgFilterIlevel', wlfgFilterIlevel);

wlfgFilterIlevel.$inject = ['$stateParams', '$location'];
function wlfgFilterIlevel($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.ilevel.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.ilevel = {active:false,min:575,max:750};

        if ($stateParams.ilevel) {
            var paramArray = $stateParams.ilevel.split(".");

            if(paramArray.length == 2 ) {
                $scope.ilevel = {active: true, min: paramArray[0], max: paramArray[1]};
                $scope.filters.ilevel = $stateParams.ilevel;
            }

        }

        $scope.filters.states.ilevel = true;

        $scope.$watch('ilevel', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.ilevel.active === false) {
                $location.search('ilevel', null);
                $scope.filters.ilevel = null;

            } else {
                $location.search('ilevel', $scope.ilevel.min+"."+$scope.ilevel.max);
                $scope.filters.ilevel = $scope.ilevel.min+"."+$scope.ilevel.max;
            }

            $scope.$parent.loading = true;
        },true);

    }
}