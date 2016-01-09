angular
    .module('app.filter')
    .directive('wlfgFilterTransfer', wlfgFilterTransfer);

wlfgFilterTransfer.$inject = ['$stateParams', '$location'];
function wlfgFilterTransfer($stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/misc/filter.transfer.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.transfert = false;
        if ($stateParams.transfert) {
            $scope.filters.transfert = $stateParams.transfert;
        }

        $scope.filters.transfert = null;

        $scope.filters.states.transfert = true;

        $scope.$watch('transfert', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.transfert) {
                $location.search('transfert', true);
                $scope.filters.transfert = true;
            } else {
                $location.search('transfert', null);
                $scope.filters.transfert = null;
            }

            $scope.$parent.loading = true;
        });
    }
}