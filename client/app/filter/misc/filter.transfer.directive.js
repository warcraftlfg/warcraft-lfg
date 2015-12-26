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

        if ($stateParams.transfert) {
            $scope.filters.transfert = $stateParams.transfert==="true";
        }

        $scope.filters.transfert = false;

        $scope.filters.states.transfert = true;

        $scope.$watch('filters.transfert', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            if ($scope.filters.transfert) {
                $location.search('transfert', true);
            } else {
                $location.search('transfert', null);
            }

            $scope.$parent.loading = true;
        });
    }
}