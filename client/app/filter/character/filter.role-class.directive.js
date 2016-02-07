angular
    .module('app.filter')
    .directive('wlfgFilterRoleClass', wlfgFilterRoleClass);

wlfgFilterRoleClass.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterRoleClass($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.role-class.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {


        $scope.classes = {
            1:{
                tank:false,
                melee_dps:false
            },
            2:{
                tank:false,
                heal:false,
                melee_dps:false
            },
            3:{
                ranged_dps:false
            },
            4:{
                melee_dps:false
            },
            5:{
                heal:false,
                ranged_dps:false
            },
            6:{
                tank:false,
                melee_dps:false
            },
            7:{
                heal:false,
                melee_dps:false,
                ranged_dps:false
            },
            8:{
                ranged_dps:false
            },
            9:{
                melee_dps:false,
            },
            10:{
                tank:false,
                heal:false,
                melee_dps:false
            },
            11:{
                tank:false,
                heal:false,
                melee_dps:false,
                ranged_dps:false
            }
        };
        $scope.localClasses = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_CLASSES")
        };

        $scope.filters.recruitment_class = [];


        if ($stateParams.class){
            var classes = $stateParams.class;
            if(!angular.isArray(classes))
                classes = [classes];

            angular.forEach($scope.classes,function(clas){
                if(classes.indexOf(clas.role+'.'+clas.id)!=-1) {
                    clas.selected = true;
                    $scope.filters.recruitment_class.push(clas.role+"."+clas.id);
                }

            });

        }


        $scope.filters.states.classes = true;

        $scope.$watch('classesOut', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }
            var tmpClasses = [];
            angular.forEach($scope.classesOut,function(clas){
                tmpClasses.push(clas.role+"."+clas.id);
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

        $scope.resetClasses = function() {
            $scope.classesOut = null;
            angular.forEach($scope.classes,function(classe) {
                classe.selected = false;
            });
        };
    }
}