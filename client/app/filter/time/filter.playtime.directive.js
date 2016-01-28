angular
    .module('app.filter')
    .directive('wlfgFilterPlayTime', wlfgFilterPlayTime);

wlfgFilterPlayTime.$inject = ['$translate', '$stateParams', '$location'];
function wlfgFilterPlayTime($translate, $stateParams, $location) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.playtime.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.playTimes = [
            {id:'monday', name: $translate.instant("MONDAY"), selected:false,start:0,end:0},
            {id:'tuesday', name: $translate.instant("TUESDAY"), selected:false,start:0,end:0},
            {id:'wednesday', name: $translate.instant("WEDNESDAY"), selected:false,start:0,end:0},
            {id:'thursday', name: $translate.instant("THURSDAY"), selected:false,start:0,end:0},
            {id:'friday', name: $translate.instant("FRIDAY"), selected:false,start:0,end:0},
            {id:'saturday', name: $translate.instant("SATURDAY"), selected:false,start:0,end:0},
            {id:'sunday', name: $translate.instant("SUNDAY"), selected:false,start:0,end:0}
        ];


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

    }
}