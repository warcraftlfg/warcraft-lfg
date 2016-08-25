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
        var classSpec = {
            1: {0: "dps", 1: "dps", 2: "dps", 3: null},
            2: {0: "heal", 1: "tank", 2: "dps", 3: null},
            3: {0: "dps", 1: "dps", 2: "dps", 3: null},
            4: {0: "dps", 1: "dps", 2: "dps", 3: null},
            5: {0: "heal", 1: "heal", 2: "dps", 3: null},
            6: {0: "tank", 1: "dps", 2: "dps", 3: null},
            7: {0: "dps", 1: "dps", 2: "heal", 3: null},
            8: {0: "dps", 1: "dps", 2: "dps", 3: null},
            9: {0: "dps", 1: "dps", 2: "dps", 3: null},
            10: {0: "tank", 1: "heal", 2: "dps", 3: null},
            11: {0: "dps", 1: "dps", 2: "tank", 3: "heal"}
        };

        scope.$watch(attrs.wlfgWarcraftLogsAverage, function(logs){
            if (logs) {
                scope.warcraftLogs = logs;
            }
        });
    }

    function average(values) {
        var sum = 0;
        for( var i = 0; i < values.length; i++ ){
            sum += values[i]; //don't forget to add the base
        }
        return sum/values.length;
    }

}