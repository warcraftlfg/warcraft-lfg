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
        $scope.$watch('filters.classes', function() {
            if($scope.$parent.loading || $scope.loading) {
                return;
            }

            var classes = [];
            angular.forEach($scope.filters.classes,function(clas){
                classes.push(clas.id);
            });

            if (classes.length > 0) {
                 $location.search('classes', classes.join('__'));
            } else {
                $location.search('classes', null);
            }

            socket.emit('get:characterAds',$scope.filters, true);
        });

        $scope.resetDays = function(){
            $scope.filters.days = [];
        };
    }
}