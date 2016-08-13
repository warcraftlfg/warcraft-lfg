angular
    .module('app.filter')
    .directive('wlfgFilterRoleClass2', wlfgFilterRoleClass2);

wlfgFilterRoleClass2.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterRoleClass2($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/guild/filter.role-class2.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.roles = {
            tank: { selected: false},
            heal: { selected: false},
            melee_dps: { selected: false},
            ranged_dps: { selected: false}
        };

        $scope.classes = {
            1: { selected: false, roles: { tank: true, melee_dps: true } },
            2: { selected: false, roles: { tank: true, heal: true,  melee_dps: true } },
            3: { selected: false, roles: { ranged_dps: true } },
            4: { selected: false, roles: { melee_dps: true } },
            5: { selected: false, roles: { heal: true, ranged_dps: true } },
            6: { selected: false, roles: { tank: true, melee_dps: true } },
            7: { selected: false, roles: { heal: true, melee_dps: true, ranged_dps: true } },
            8: { selected: false, roles: { ranged_dps: true } },
            9: { selected: false, roles: { ranged_dps: true } },
            10: { selected: false, roles: { tank: true, heal: true, melee_dps: true } },
            11: { selected: false, roles: { tank: true, heal: true, melee_dps: true, ranged_dps: true } },
            12: { selected: false, roles: { tank: true, melee_dps: true } }
        };

        $scope.filters.recruitment_class = [];
        $scope.filters.role = null;

        if ($stateParams.role) {
            var roles = $stateParams.role;

            if (!angular.isArray(roles)) {
                roles = [roles];
            }

            angular.forEach(roles, function (role) {
                $scope.roles[role].selected = true;
            });
        }

        if ($stateParams.class) {
            var classes = $stateParams.class;
            if (!angular.isArray(classes)) {
                classes = [classes];
            }

            angular.forEach(classes, function (value) {
                $scope.filters.recruitment_class.push(value);
            });

            angular.forEach($scope.classes, function (value, key) {
                if (classes.indexOf("tank."+key) != -1 || classes.indexOf("heal."+key) != -1 || classes.indexOf("melee_dps."+key) != -1 || classes.indexOf("ranged_dps."+key) != -1 ) {
                    value.selected = true;
                }
            });
        }

        $scope.filters.states.roles = true;
        $scope.filters.states.classes = true;

        $scope.$watch('roles', function () {
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

            $scope.createRoleClassFilter();
        }, true);

        $scope.$watch('classes', function () {
            $scope.createRoleClassFilter();
        }, true);

        $scope.createRoleClassFilter = function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var tmpClasses = [];
            var selected = 0;

            angular.forEach($scope.classes, function (clas, id) {
                if (clas.selected) {
                    selected++;
                    if (!$scope.roles.tank.selected && !$scope.roles.heal.selected && !$scope.roles.melee_dps.selected && !$scope.roles.ranged_dps.selected) {
                        if (clas.roles.tank) { tmpClasses.push('tank' + "." + id); }
                        if (clas.roles.melee_dps) { tmpClasses.push('melee_dps' + "." + id); }
                        if (clas.roles.heal) { tmpClasses.push('heal' + "." + id); }
                        if (clas.roles.ranged_dps) { tmpClasses.push('ranged_dps' + "." + id); }
                    } else {
                        if ($scope.roles.tank.selected) {
                            if (clas.roles.tank) { tmpClasses.push('tank' + "." + id); }
                        }
                        if ($scope.roles.heal.selected) {
                            if (clas.roles.heal) { tmpClasses.push('heal' + "." + id); }
                        }
                        if ($scope.roles.melee_dps.selected) {
                            if (clas.roles.melee_dps) { tmpClasses.push('melee_dps' + "." + id); }
                        }
                        if ($scope.roles.ranged_dps.selected) {
                            if (clas.roles.ranged_dps) { tmpClasses.push('ranged_dps' + "." + id); }
                        }
                    }
                }
            });

            if (selected === 0) {
                if ($scope.roles.tank.selected || $scope.roles.heal.selected || $scope.roles.melee_dps.selected || $scope.roles.ranged_dps.selected) {
                    angular.forEach($scope.classes, function (clas, id) {
                        if ($scope.roles.tank.selected) {
                            if (clas.roles.tank) { tmpClasses.push('tank' + "." + id); }
                        }
                        if ($scope.roles.heal.selected) {
                            if (clas.roles.heal) { tmpClasses.push('heal' + "." + id); }
                        }
                        if ($scope.roles.melee_dps.selected) {
                            if (clas.roles.melee_dps) { tmpClasses.push('melee_dps' + "." + id); }
                        }
                        if ($scope.roles.ranged_dps.selected) {
                            if (clas.roles.ranged_dps) { tmpClasses.push('ranged_dps' + "." + id); }
                        }   
                    });
                }
            }

            if (!angular.equals($stateParams.class, tmpClasses)) {
                $scope.$parent.loading = true;
            }

            if (tmpClasses.length > 0) {
                $location.search('class', tmpClasses);
                $scope.filters.recruitment_class = tmpClasses;
            } else {
                $location.search('class', null);
                $scope.filters.recruitment_class = null;
            }
        };

    }
}