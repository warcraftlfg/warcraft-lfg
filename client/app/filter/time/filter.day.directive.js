angular
    .module('app.filter')
    .directive('wlfgFilterDay', wlfgFilterDay);

wlfgFilterDay.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterDay(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.day.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.days', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            var days = [];
            angular.forEach($scope.filters.days,function(day){
                days.push(day.id);
            });

            if (days.length > 0) {
                 $location.search('days', days.join('__'));
            } else {
                $location.search('days', null);
            }

            //socket.emit('get:characterAds',$scope.filters, true);
        },true);

        $scope.resetDays = function(){
            $scope.filters.days = [];
        };
    }
}