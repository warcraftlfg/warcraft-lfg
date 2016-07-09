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
        $scope.progress = {difficulty:"none",min:1,max:13};


        if ($stateParams.progress) {
            $scope.filters.progress = $stateParams.progress;
            $scope.progress.active = true;
            $scope.progress.difficulty = $stateParams.progress.split(".")[0];
            $scope.progress.min = $stateParams.progress.split(".")[1];
            $scope.progress.max = $stateParams.progress.split(".")[2];

        }

        $scope.filters.states.progress = true;

        // Allow the progress filter to be toggled off by clicking on the
        // currently active difficulty. This avoids the need for a fourth
        // box with value="none" to clear the selection.
        // http://stackoverflow.com/questions/25443018/angularjs-is-it-possible-to-deselect-html-radio-input-by-click
        var lastDifficulty = $scope.progress.difficulty;
        $scope.maybeToggleOff = function (event) {
            if (event.target.value === lastDifficulty) {
                $scope.progress.difficulty = "none";
                lastDifficulty = "none";
            } else {
                lastDifficulty = event.target.value;
            }
        };

        $scope.$watch('progress', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.progress.difficulty === "none") {
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