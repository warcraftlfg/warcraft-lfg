angular
    .module('app.filter')
    .directive('wlfgFilterClass', wlfgFilterClass);

wlfgFilterClass.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterClass($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/character/filter.class.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.classes = [
            {id:1, name: "<span class='class-1'>"+$translate.instant("CLASS_1")+"</span>", icon:"<img src='/assets/images/icon/16/class-1.png'>", selected:false},
            {id:2, name: "<span class='class-2'>"+$translate.instant("CLASS_2")+"</span>", icon:"<img src='/assets/images/icon/16/class-2.png'>", selected:false},
            {id:3, name: "<span class='class-3'>"+$translate.instant("CLASS_3")+"</span>", icon:"<img src='/assets/images/icon/16/class-3.png'>", selected:false},
            {id:4, name: "<span class='class-4'>"+$translate.instant("CLASS_4")+"</span>", icon:"<img src='/assets/images/icon/16/class-4.png'>", selected:false},
            {id:5, name: "<span class='class-5'>"+$translate.instant("CLASS_5")+"</span>", icon:"<img src='/assets/images/icon/16/class-5.png'>", selected:false},
            {id:6, name: "<span class='class-6'>"+$translate.instant("CLASS_6")+"</span>", icon:"<img src='/assets/images/icon/16/class-6.png'>", selected:false},
            {id:7, name: "<span class='class-7'>"+$translate.instant("CLASS_7")+"</span>", icon:"<img src='/assets/images/icon/16/class-7.png'>", selected:false},
            {id:8, name: "<span class='class-8'>"+$translate.instant("CLASS_8")+"</span>", icon:"<img src='/assets/images/icon/16/class-8.png'>", selected:false},
            {id:9, name: "<span class='class-9'>"+$translate.instant("CLASS_9")+"</span>", icon:"<img src='/assets/images/icon/16/class-9.png'>", selected:false},
            {id:10, name: "<span class='class-10'>"+$translate.instant("CLASS_10")+"</span>", icon:"<img src='/assets/images/icon/16/class-10.png'>", selected:false},
            {id:11, name: "<span class='class-11'>"+$translate.instant("CLASS_11")+"</span>", icon:"<img src='/assets/images/icon/16/class-11.png'>", selected:false}
        ];

        $scope.filters.classes = [];

        if($stateParams.classes){
            var classes = $stateParams.classes.split("__");
            angular.forEach($scope.classes,function(clas){
                if(classes.indexOf(clas.id.toString())!=-1) {
                    clas.selected = true;
                    $scope.filters.classes.push({id:clas.id,selected:true});
                }
            });
        }

        $scope.localClasses = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_CLASSES")
        };

        $scope.filters.states.classes = true;

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
            
            $scope.$parent.loading = true;
        },true);

        $scope.resetClasses = function() {
            $scope.filters.classes = [];
            angular.forEach($scope.classes,function(classe) {
                classe.selected = false;
            });
        };
    }
}