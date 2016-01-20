angular
    .module('app.filter')
    .directive('wlfgFilterRpw', wlfgFilterRpw);

wlfgFilterRpw.$inject = ['$stateParams', '$location'];
function wlfgFilterRpw($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.rpw.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.raids_per_week = {active:false,min:1,max:7};

        if ($stateParams.raids_per_week) {
            var paramArray = $stateParams.raids_per_week.split(".");
            if(paramArray.length == 2 ){

                $scope.filters.raids_per_week = $stateParams.raids_per_week;
                $scope.raids_per_week = {active:true,min:paramArray[0],max:paramArray[1]};
            }
        }

        $scope.filters.states.rpw = true;

        $scope.$watch('raids_per_week', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.raids_per_week.active === false) {
                $location.search('raids_per_week', null);
                $scope.filters.raids_per_week = null;
            } else {
                $location.search('raids_per_week', $scope.raids_per_week.min+"."+$scope.raids_per_week.max);
                $scope.filters.raids_per_week = $scope.raids_per_week.min+"."+$scope.raids_per_week.max;
            }

            $scope.$parent.loading = true;
        },true);

    }
}