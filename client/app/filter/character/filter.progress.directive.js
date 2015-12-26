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
        $scope.filters.progress = {};
        $scope.filters.progress.kill = "13";
        $scope.filters.progress.difficulty = "mythic";

        if ($stateParams.progress_active) {
            $scope.filters.progress.active = $stateParams.progress_active==="true";
        }

        if ($stateParams.progress_kill) {
            $scope.filters.progress.kill = $stateParams.progress_kill;
        }

        if ($stateParams.progress_difficulty) {
            $scope.filters.progress.difficulty = $stateParams.progress_difficulty;
        }

        $scope.filters.states.progress = true;

        $scope.$watch('filters.progress.active', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.progress.active === false) {
                $location.search('progress_kill', null);
                $location.search('progress_difficulty', null);
                $location.search('progress_active', null);
            } else {
                $location.search('progress_active', true);
            }

            $scope.$parent.loading = true;
        });

        $scope.$watch('filters.progress.kill', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.progress.kill) {
                $location.search('progress_kill', $scope.filters.progress.kill);
            } else {
                $location.search('progress_kill', null);
            }

            $scope.$parent.loading = true;
        });

        $scope.$watch('filters.progress.difficulty', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.progress.difficulty) {
                $location.search('progress_difficulty', $scope.filters.progress.difficulty);
            } else {
                $location.search('progress_difficulty', null);
            }

            $scope.$parent.loading = true;
        });
    }
}