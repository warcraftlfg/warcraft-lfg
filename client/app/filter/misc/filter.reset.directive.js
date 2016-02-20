angular
    .module('app.filter')
    .directive('wlfgFilterReset', wlfgFilterReset);

wlfgFilterReset.$inject = ['$state'];
function wlfgFilterReset($state) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/misc/filter.reset.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.resetFilters = function(){
            $state.go($state.current, null, {reload: true, inherit: false});
        };
    }
}