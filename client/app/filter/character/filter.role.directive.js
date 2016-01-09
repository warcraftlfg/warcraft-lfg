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
        $scope.roles = [
            {id:'tank', name: $translate.instant("TANK"), icon:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:'heal', name: $translate.instant("HEAL"), icon:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:'melee_dps', name: $translate.instant("MELEE_DPS"), icon:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:'ranged_dps', name: $translate.instant("RANGED_DPS"), icon:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false}
        ];

        $scope.filters.role = [];

        if($stateParams.role){
            var roles = $stateParams.role;

            if(!angular.isArray(roles))
                roles = [roles];
            angular.forEach($scope.roles,function(role){
                if(roles.indexOf(role.id)!=-1) {
                    role.selected = true;
                    $scope.filters.role.push(role.id);
                }
            });

        }

        $scope.filters.states.role = true;

        $scope.localRoles = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_ROLES")
        };


        $scope.$watch('rolesOut', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var roles = [];
            angular.forEach($scope.rolesOut,function(role){
                roles.push(role.id);
            });

            if (roles.length > 0) {
                 $location.search('role', roles);
                $scope.filters.role = roles;
            } else {
                $location.search('role', null);
                $scope.filters.role = null;
            }

            $scope.$parent.loading = true;
        },true);

        $scope.resetRoles = function() {
            $scope.rolesOut = null;
            angular.forEach($scope.roles,function(role) {
                role.selected = false;
            });
        };
    }
}