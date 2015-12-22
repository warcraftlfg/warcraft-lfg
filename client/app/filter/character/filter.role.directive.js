angular
    .module('app.filter')
    .directive('wlfgFilterRole', wlfgFilterRole);

wlfgFilterRole.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterRole($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.role.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.filters.states.role = false;

        $scope.roles = [
            {id:'tank', name: $translate.instant("TANK"), icon:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:'heal', name: $translate.instant("HEAL"), icon:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:'melee_dps', name: $translate.instant("MELEE_DPS"), icon:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:'ranged_dps', name: $translate.instant("RANGED_DPS"), icon:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false}
        ];

        if($stateParams.roles){
            var roles = $stateParams.roles.split("__");

            angular.forEach($scope.roles,function(role){
                if(roles.indexOf(role.id)!=-1) {
                    role.selected = true;
                    $scope.filters.roles.push({id:role.id,selected:true});
                }
            });
        }

        $scope.localRoles = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_ROLES")
        };

        $scope.filters.states.role = true;

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

            ////socket.emit('get:characterAds', $scope.filters, true);
        },true);

        $scope.resetRoles = function(){
            $scope.filters.roles = [];
        };
    }
}