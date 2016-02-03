angular
    .module('app.filter')
    .directive('wlfgFilterDay', wlfgFilterDay);

wlfgFilterDay.$inject = ['$translate', '$stateParams', '$location','moment'];
function wlfgFilterDay($translate, $stateParams, $location,moment) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.day.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.days = {
            monday: {name: "Mo", selected: false, start: 0, end: 0},
            tuesday: {name: "Tu", selected: false, start: 0, end: 0},
            wednesday: {name: "We", selected: false, start: 0, end: 0},
            thursday: {name: "Th", selected: false, start: 0, end: 0},
            friday: {name: "Fr", selected: false, start: 0, end: 0},
            saturday: {name: "Sa", selected: false, start: 0, end: 0},
            sunday: {name: "Su", selected: false, start: 0, end: 0}
        };


        $scope.filters.day = [];

        if ($stateParams.day) {
            var days = $stateParams.day;
            if (!angular.isArray(days)) {
                days = [days];
            }
            angular.forEach($scope.days, function (day,key) {

                angular.forEach(days, function (dayString) {
                    var params = dayString.split('.');
                    if (params.length == 3) {

                        if (params && params[0] == key) {
                            day.selected = true;
                            day.start = moment(params[1]).tz(params[1]).hours();
                            day.end = moment(params[2]).tz(params[1]).hours();

                            $scope.filters.day.push(dayString);
                        }
                    }
                });
            });
        }

        $scope.filters.states.days = true;

        $scope.$watch('daysOut', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var days = [];
            angular.forEach($scope.daysOut, function (day) {
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
        }, true);

    }
}