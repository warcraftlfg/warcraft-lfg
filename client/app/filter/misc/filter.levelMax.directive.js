angular
    .module('app.filter')
    .directive('wlfgFilterLevelMax', wlfgFilterLevelMax);

wlfgFilterLevelMax.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterLevelMax(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/misc/filter.levelMax.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.lvlmax', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.lvlmax === false) {
                $location.search('lvlmax', false);
            } else {
                $location.search('lvlmax', null);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}