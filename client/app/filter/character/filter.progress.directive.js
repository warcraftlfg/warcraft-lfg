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
        $scope.progress = {};
        $scope.progress.kill = "13";
        $scope.progress.difficulty = "mythic";
        console.log($stateParams);

        if ($stateParams.progress) {
            $scope.filters.progress = $stateParams.progress;
            $scope.progress.active = true;
            $scope.progress.difficulty = $stateParams.progress.split(".")[0];
            $scope.progress.kill = $stateParams.progress.split(".")[1];

        }

        $scope.filters.states.progress = true;

        $scope.$watch('progress', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.progress.active === false) {
                $location.search('progress', null);
                $scope.filters.progress = null;
            } else {
                $location.search('progress', $scope.progress.difficulty + "."+ $scope.progress.kill);
                $scope.filters.progress = $scope.progress.difficulty + "."+ $scope.progress.kill;
            }

            $scope.$parent.loading = true;
        },true);
    }
}