angular
    .module('app.filter')
    .directive('wlfgFilterRoleClass', wlfgFilterRoleClass);

wlfgFilterRoleClass.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterRoleClass($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/guild/filter.role-class.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {

        $scope.classes = {
            1: {
                selected: false,
                roles: {
                    tank: false,
                    melee_dps: false
                }
            },
            2: {
                selected: false,
                roles: {
                    tank: false,
                    heal: false,
                    melee_dps: false
                }
            },
            3: {
                selected: false,
                roles: {
                    ranged_dps: false
                }
            },
            4: {
                selected: false,
                roles: {
                    melee_dps: false
                }
            },
            5: {
                selected: false,
                roles: {
                    heal: false,
                    ranged_dps: false
                }
            },
            6: {
                selected: false,
                roles: {
                    tank: false,
                    melee_dps: false
                }
            },
            7: {
                selected: false,
                roles: {
                    heal: false,
                    melee_dps: false,
                    ranged_dps: false
                }
            },
            8: {
                selected: false,
                roles: {
                    ranged_dps: false
                }
            },
            9: {
                selected: false,
                roles: {
                    ranged_dps: false,
                }
            },
            10: {
                selected: false,
                roles: {
                    tank: false,
                    heal: false,
                    melee_dps: false
                }
            },
            11: {
                selected: false,
                roles: {
                    tank: false,
                    heal: false,
                    melee_dps: false,
                    ranged_dps: false
                }
            },
            12: {
                selected: false,
                roles: {
                    tank: false,
                    melee_dps: false,
                }
            }
        };

        $scope.filters.recruitment_class = [];

        if ($stateParams.class) {
            var classes = $stateParams.class;
            if (!angular.isArray(classes)) {
                classes = [classes];
            }
            angular.forEach($scope.classes, function (clas) {
                if (classes.indexOf(clas.role + '.' + clas.id) != -1) {
                    clas.selected = true;
                    $scope.filters.recruitment_class.push(clas.role + "." + clas.id);
                }
            });
        }

        $scope.filters.states.classes = true;

        $scope.$watch('classes', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var tmpClasses = [];

            angular.forEach($scope.classes, function (clas, id) {
                var isSelected = false;
                angular.forEach(clas.roles, function (selected, role) {
                    isSelected = isSelected || selected;
                    if (selected) {
                        tmpClasses.push(role + "." + id);
                    }

                });
                clas.selected = isSelected;

            });



            if (tmpClasses.length > 0) {
                $location.search('class', tmpClasses);
                $scope.filters.recruitment_class = tmpClasses;
            } else {
                $location.search('class', null);
                $scope.filters.recruitment_class = null;
            }
            $scope.$parent.loading = true;


        }, true);

        $scope.switchClass = function (clas) {

            angular.forEach(clas.roles, function (selected, role) {
                clas.roles[role] = !clas.selected;
            });
        };

    }
}