angular
    .module('app.filter')
    .directive('wlfgFilterDay', wlfgFilterDay);

wlfgFilterDay.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterDay($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.day.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.days = [
            {id:'monday', name: $translate.instant("MONDAY"), selected:false},
            {id:'tuesday', name: $translate.instant("TUESDAY"), selected:false},
            {id:'wednesday', name: $translate.instant("WEDNESDAY"), selected:false},
            {id:'thursday', name: $translate.instant("THURSDAY"), selected:false},
            {id:'friday', name: $translate.instant("FRIDAY"), selected:false},
            {id:'saturday', name: $translate.instant("SATURDAY"), selected:false},
            {id:'sunday', name: $translate.instant("SUNDAY"), selected:false},
        ];

        $scope.localDays = {
            selectAll       : $translate.instant("SELECT_ALL"),
            selectNone      : $translate.instant("SELECT_NONE"),
            reset           : $translate.instant("RESET"),
            search          : $translate.instant("SEARCH"),
            nothingSelected : $translate.instant("ALL_DAYS")
        };

        $scope.filters.day = [];

        if($stateParams.day){
            var days = $stateParams.day;
            if(!angular.isArray(days))
                days = [days];
            angular.forEach($scope.days,function(day){
                if(days.indexOf(day.id)!=-1) {
                    day.selected = true;
                    $scope.filters.day.push(day.id);
                }
            });
        }

        $scope.filters.states.days = true;

        $scope.$watch('daysOut', function() {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var days = [];
            angular.forEach($scope.daysOut,function(day){
                days.push(day.id);
            });

            if (days.length > 0) {
                 $location.search('day', days);
                $scope.filters.day = days;
            } else {
                $location.search('day', null);
                days.filters.day = null;
            }

            $scope.$parent.loading = true;
        },true);

        $scope.resetDays = function() {
            $scope.daysOut = [];
            angular.forEach($scope.days,function(day) {
                day.selected = false;
            });
        };
    }
}