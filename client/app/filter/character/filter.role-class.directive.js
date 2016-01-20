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

        $scope.classes = [
            {name: '<span class="icon-small tank">'+$translate.instant("TANKS")+'</span>', msGroup: true},
            {id:1, role:"tank", name: "<span class='class-1'>"+$translate.instant("CLASS_1")+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>",iconrole:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:11, role:"tank", name: "<span class='class-11'>"+$translate.instant("CLASS_11")+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>",iconrole:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:2, role:"tank", name: "<span class='class-2'>"+$translate.instant("CLASS_2")+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>",iconrole:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:10, role:"tank", name: "<span class='class-10'>"+$translate.instant("CLASS_10")+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>",iconrole:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            {id:6, role:"tank", name: "<span class='class-6'>"+$translate.instant("CLASS_6")+"</span>", icon:"<img src='/assets/images/icon/16/class-6.png'>",iconrole:"<img src='/assets/images/icon/16/tank.png'>", selected:false},
            { msGroup: false},
            {name: '<span class="icon-small heal">'+$translate.instant("HEALS")+'</span>', msGroup: true},
            {id:11, role:"heal", name: "<span class='class-11'>"+$translate.instant("CLASS_11")+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>",iconrole:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:5, role:"heal", name: "<span class='class-5'>"+$translate.instant("CLASS_5")+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>",iconrole:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:2, role:"heal", name: "<span class='class-2'>"+$translate.instant("CLASS_2")+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>",iconrole:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:7, role:"heal", name: "<span class='class-7'>"+$translate.instant("CLASS_7")+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>",iconrole:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            {id:10, role:"heal", name: "<span class='class-10'>"+$translate.instant("CLASS_10")+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>",iconrole:"<img src='/assets/images/icon/16/healing.png'>", selected:false},
            { msGroup: false},
            {name: '<span class="icon-small dps">'+$translate.instant("MELEE_DPS")+'</span>', msGroup: true},
            {id:11, role:"melee_dps", name: "<span class='class-11'>"+$translate.instant("CLASS_11")+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:6, role:"melee_dps", name: "<span class='class-6'>"+$translate.instant("CLASS_6")+"</span>", icon:"<img src='/assets/images/icon/16/class-6.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:2, role:"melee_dps", name: "<span class='class-2'>"+$translate.instant("CLASS_2")+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:10, role:"melee_dps", name: "<span class='class-10'>"+$translate.instant("CLASS_10")+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:7, role:"melee_dps", name: "<span class='class-7'>"+$translate.instant("CLASS_7")+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:1, role:"melee_dps", name: "<span class='class-1'>"+$translate.instant("CLASS_1")+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            {id:4, role:"melee_dps", name: "<span class='class-4'>"+$translate.instant("CLASS_4")+"</span>", icon:"<img src='/assets/images/icon/16/class-4.png'>",iconrole:"<img src='/assets/images/icon/16/dps.png'>", selected:false},
            { msGroup: false},
            {name: '<span class="icon-small ranged-dps">'+$translate.instant("RANGED_DPS")+'</span>', msGroup: true},
            {id:11, role:"ranged_dps", name: "<span class='class-11'>"+$translate.instant("CLASS_11")+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>",iconrole:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false},
            {id:5, role:"ranged_dps", name: "<span class='class-5'>"+$translate.instant("CLASS_5")+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>",iconrole:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false},
            {id:7, role:"ranged_dps", name: "<span class='class-7'>"+$translate.instant("CLASS_7")+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>",iconrole:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false},
            {id:3, role:"ranged_dps", name: "<span class='class-3'>"+$translate.instant("CLASS_3")+"</span>", icon:"<img src='/assets/images/icon/16/class-3.png'>",iconrole:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false},
            {id:9, role:"ranged_dps", name: "<span class='class-9'>"+$translate.instant("CLASS_9")+"</span>", icon:"<img src='/assets/images/icon/16/class-9.png'>",iconrole:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false},
            {id:8, role:"ranged_dps", name: "<span class='class-8'>"+$translate.instant("CLASS_8")+"</span>", icon:"<img src='/assets/images/icon/16/class-8.png'>",iconrole:"<img src='/assets/images/icon/16/ranged-dps.png'>", selected:false},
            { msGroup: false}
        ];

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