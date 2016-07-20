angular
    .module('app.filter')
    .directive('wlfgFilterClass', wlfgFilterClass);

wlfgFilterClass.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterClass($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.class.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.classes = [
            {id: 1, selected: false},
            {id: 2, selected: false},
            {id: 3, selected: false},
            {id: 4, selected: false},
            {id: 5, selected: false},
            {id: 6, selected: false},
            {id: 7, selected: false},
            {id: 8, selected: false},
            {id: 9, selected: false},
            {id: 10, selected: false},
            {id: 11, selected: false},
            {id: 12, selected: false}
        ];

        $scope.filters.class = [];

        if ($stateParams.class) {
            var classes = $stateParams.class;
            angular.forEach($scope.classes, function (clas) {
                if (classes.indexOf(clas.id.toString()) != -1) {
                    clas.selected = true;
                    $scope.filters.class.push(clas.id);
                }
            });
        }

        $scope.filters.states.classes = true;

        $scope.$watch('classes', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var classes = [];
            angular.forEach($scope.classes, function (classe) {
                if (classe.selected) {
                    classes.push(classe.id);
                }
            });

            if (classes.length > 0) {
                $location.search('class', classes);
                $scope.filters.class = classes;
            } else {
                $location.search('class', null);
                $scope.filters.class = null;
            }

            $scope.$parent.loading = true;
        }, true);
    }
}