angular
    .module('app.character')
    .directive('wlfgWarcraftLogsAverage', wlfgWarcraftLogsAverage);

function wlfgWarcraftLogsAverage() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/wcl/character.warcraft-logs-average.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgWarcraftLogsAverage, function(logs) {
            if (logs) {
                scope.warcraftLogs = logs;
            }
        });
    }
}