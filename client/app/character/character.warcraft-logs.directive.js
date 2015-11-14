angular
    .module('app.character')
    .directive('wlfgWarcraftLogs', warcraftLogs);

function warcraftLogs() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/character.warcraft-logs.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgWarcraftLogs, function(logs){
            if (logs) {
                var sortedLogs = {3:{0:[],'1':[],'2':[],'3':[]},4:{0:[],'1':[],'2':[],'3':[]},5:{0:[],'1':[],'2':[],'3':[]}};
                var ratioFound = false;
                logs.forEach(function (log) {
                    var ratio = 1-(log.rank/log.outOf);
                    if(log.difficulty>=3 && log.difficulty <=5) {
                        sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                        ratioFound = true;
                    }
                });
                if(ratioFound) {
                    scope.warcraftLogs = {
                        5: {0: null, '1': null, '2': null, '3': null},
                        4: {0: null, '1': null, '2': null, '3': null},
                        3: {0: null, '1': null, '2': null, '3': null}
                    };

                    for (var difficulty = 3; difficulty <= 5; difficulty++) {
                        for (var spec = 0; spec <= 3; spec++) {
                            if (sortedLogs[difficulty][spec].length > 0)
                                scope.warcraftLogs[difficulty][spec] = Math.floor(median(sortedLogs[difficulty][spec]) * 100);
                        }
                    }
                }

            }
        });
    }

    function median(values) {
        values.sort( function(a,b) {return a - b;} );
        var half = Math.floor(values.length/2);
        if(values.length % 2)
            return values[half];
        else
            return (values[half-1] + values[half]) / 2.0;
    }

}