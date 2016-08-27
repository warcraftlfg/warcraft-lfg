angular
    .module('app.character')
    .directive('wlfgWarcraftLogsInfo', warcraftLogsInfo);

function warcraftLogsInfo() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/wcl/character.warcraft-logs-info.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgWarcraftLogsInfo, function(logs){
            console.log(logs);
            if (logs) {
                scope.warcraftLogs = logs;
            }
        });
    }
}