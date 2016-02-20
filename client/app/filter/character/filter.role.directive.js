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

        $scope.roles = {
            tank: {selected: false},
            heal: {selected: false},
            melee_dps: {selected: false},
            ranged_dps: {selected: false}
        };

        $scope.filters.role = [];

        if ($stateParams.role) {
            var roles = $stateParams.role;

            if (!angular.isArray(roles)) {
                roles = [roles];
            }
            angular.forEach(roles, function (role) {
                $scope.roles[role].selected = true;
                $scope.filters.role.push(role);
            });
        }

        $scope.filters.states.role = true;

        $scope.$watch('roles', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var roles = [];
            angular.forEach($scope.roles, function (role,key) {
                if (role.selected) {
                    roles.push(key);
                }
            });

            if (roles.length > 0) {
                $location.search('role', roles);
                $scope.filters.role = roles;
            } else {
                $location.search('role', null);
                $scope.filters.role = null;
            }

            $scope.$parent.loading = true;
        }, true);
    }
}