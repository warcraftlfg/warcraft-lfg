angular
    .module('app.filter')
    .directive('wlfgFilterProgress', wlfgFilterProgress);

wlfgFilterProgress.$inject = ['$stateParams', '$location'];
function wlfgFilterProgress($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.progress.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.progress = {difficulty:"mythic",min:0,max:13};


        if ($stateParams.progress) {
            $scope.filters.progress = $stateParams.progress;
            $scope.progress.active = true;
            $scope.progress.difficulty = $stateParams.progress.split(".")[0];
            $scope.progress.min = $stateParams.progress.split(".")[1];
            $scope.progress.max = $stateParams.progress.split(".")[2];

        }

        $scope.filters.states.progress = true;

        $scope.$watch('progress', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.progress.difficulty === "mythic" && $scope.progress.min === 0 && $scope.progress.max === 13) {
                $location.search('progress', null);
                $scope.filters.progress = null;
            } else {
                $location.search('progress', $scope.progress.difficulty + "."+ $scope.progress.min+ "."+ $scope.progress.max);
                $scope.filters.progress = $scope.progress.difficulty + "."+ $scope.progress.min+ "."+ $scope.progress.max;
            }

            $scope.$parent.loading = true;
        },true);
    }
}