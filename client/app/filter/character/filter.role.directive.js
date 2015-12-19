angular
    .module('app.filter')
    .directive('wlfgFilterRole', wlfgFilterRole);

wlfgFilterRole.$inject = ['socket', '$stateParams', '$location'];
function wlfgFilterRole(socket, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.role.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.$watch('filters.roles', function() {
            if( $scope.$parent.loading || $scope.loading) {
                return;
            }

            var roles = [];
            angular.forEach($scope.filters.roles,function(role){
                roles.push(role.id);
            });

            if (roles.length > 0) {
                 $location.search('roles', roles.join('__'));
            } else {
                $location.search('roles', null);
            }

            socket.emit('get:characterAds', $scope.filters, true);
        });

        $scope.resetRoles = function(){
            $scope.filters.roles = [];
        };
    }
}