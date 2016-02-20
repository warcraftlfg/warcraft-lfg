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
        var min = 575;
        var max = 750;
        $scope.ilevel = {min:min,max:max};

        if ($stateParams.ilevel) {
            var paramArray = $stateParams.ilevel.split(".");

            if(paramArray.length == 2 ) {
                $scope.ilevel = {min: paramArray[0], max: paramArray[1]};
                $scope.filters.ilevel = $stateParams.ilevel;
            }

        }

        $scope.filters.states.ilevel = true;

        $scope.$watch('ilevel', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.ilevel.min == min && $scope.ilevel.max == max) {
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