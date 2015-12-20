angular
    .module('app.filter')
    .directive('wlfgSort', wlfgSort);

wlfgSort.$inject = ['socket', '$stateParams', '$location'];
function wlfgSort(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/sort/filter.sort.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('sort', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            $location.search('sort', $scope.sort);

            //socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}