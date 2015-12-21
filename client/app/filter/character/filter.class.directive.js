angular
    .module('app.filter')
    .directive('wlfgFilterClass', wlfgFilterClass);

wlfgFilterClass.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterClass(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.class.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.$watch('filters.classes', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var classes = [];
            angular.forEach($scope.filters.classes,function(classe){
                classes.push(classe.id);
            });

            if (classes.length > 0) {
                $location.search('classes', classes.join('__'));
            } else {
                $location.search('classes', null);
            }

            socket.emit('get:characterAds',$scope.filters, true);

        },true);

        $scope.resetClasses = function(){
            $scope.filters.classes = [];
        };
    }
}