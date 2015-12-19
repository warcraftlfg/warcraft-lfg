angular
    .module('app.filter')
    .directive('wlfgFilterTransfer', wlfgFilterTransfer);

wlfgFilterTransfer.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterTransfer(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/misc/filter.transfer.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.transfert', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.transfert) {
                $location.search('transfert', true);
            } else {
                $location.search('transfert', null);
            }

            socket.emit('get:characterAds',$scope.filters, true);
        });
    }
}