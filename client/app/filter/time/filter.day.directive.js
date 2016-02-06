angular
    .module('app.filter')
    .directive('wlfgFilterDay', wlfgFilterDay);

wlfgFilterDay.$inject = ['$translate', '$stateParams', '$location', 'moment', 'TIMEZONES'];
function wlfgFilterDay($translate, $stateParams, $location, moment, TIMEZONES) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/filter/time/filter.day.directive.html'
    };

    return directive;

    function link($scope, element, attrs) {
        $scope.timezones = TIMEZONES;

        var guessTimeZone = moment.tz.guess();

        if ($scope.timezones.indexOf(guessTimeZone) != -1) {
            $scope.timezone = guessTimeZone;
        } else {
            $scope.timezone = "Europe/London";
        }

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

        if ($stateParams.timezone) {
            $scope.timezone = $stateParams.timezone;
        }

        if ($stateParams.day) {
            var days = $stateParams.day;
            if (!angular.isArray(days)) {
                days = [days];
            }
            angular.forEach($scope.days, function (day, key) {

                angular.forEach(days, function (dayString) {
                    var params = dayString.split('.');
                    if (params.length == 3) {
                        if (params && params[0] == key) {
                            day.selected = true;
                            day.start = params[1];
                            day.end = params[2];
                            $scope.filters.day.push(dayString + '.' + $scope.timezone);
                        }
                    }
                });
            });
        }

        $scope.filters.states.days = true;

        $scope.$watch('[days,timezone]', function () {
            if ($scope.$parent.loading || $scope.loading) {
                return;
            }

            var days = [];
            var daysParams = [];
            angular.forEach($scope.days, function (day, key) {
                if (day.selected) {
                    days.push(key + '.' + day.start + '.' + day.end + '.' + $scope.timezone);
                    daysParams.push(key + '.' + day.start + '.' + day.end);
                }
            });

            if (days.length > 0) {
                $location.search('day', daysParams);
                $location.search('timezone', $scope.timezone);
                if (!angular.equals(days, $scope.filters.day)) {
                    $scope.$parent.loading = true;
                }
                $scope.filters.day = days;


            } else {
                $location.search('day', null);
                $location.search('timezone', null);
                if (!angular.equals(days, $scope.filters.day)) {
                    $scope.$parent.loading = true;
                }
                $scope.filters.day = [];
            }

        }, true);

    }


}