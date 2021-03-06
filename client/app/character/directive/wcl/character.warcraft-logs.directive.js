angular
    .module('app.character')
    .directive('wlfgWarcraftLogs', warcraftLogs);

function warcraftLogs() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/directive/wcl/character.warcraft-logs.directive.html'
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

        scope.$watch(attrs.wlfgWarcraftLogs, function(logs) {
            if (logs) {
                var sortedLogs = {3:{0:[],'1':[],'2':[],'3':[]},4:{0:[],'1':[],'2':[],'3':[]},5:{0:[],'1':[],'2':[],'3':[]}};
                var ratioFound = false;
                
                if (logs.dps && logs.dps instanceof Array) {
                    logs.dps.forEach(function (log) {
                        var ratio = 1-(log.rank/log.outOf);
                        if (log.difficulty >= 3 && log.difficulty <= 5 ) {
                            if (classSpec[attrs.characterClass][log.spec-1] == "dps" || classSpec[attrs.characterClass][log.spec-1] == "tank") {
                                sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                                ratioFound = true;
                            }
                        }
                    });
                }

                if (logs.hps && logs.hps instanceof Array) {
                    logs.hps.forEach(function (log) {
                        var ratio = 1-(log.rank/log.outOf);
                        if (log.difficulty >= 3 && log.difficulty <= 5 ) {
                            if (classSpec[attrs.characterClass][log.spec-1] == "heal") {
                                sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                                ratioFound = true;
                            }
                        }
                    });
                }

                if (!logs.dps && !logs.hps) {
                    logs.forEach(function (log) {
                        var ratio = 1-(log.rank/log.outOf);
                        if (log.difficulty >= 3 && log.difficulty <= 5 ) {
                            sortedLogs[log.difficulty][log.spec - 1].push(ratio);
                            ratioFound = true;
                        }
                    });
                }

                if (ratioFound) {
                    scope.warcraftLogs = {
                        5: {0: null, '1': null, '2': null, '3': null},
                        4: {0: null, '1': null, '2': null, '3': null},
                        3: {0: null, '1': null, '2': null, '3': null}
                    };

                    for (var difficulty = 3; difficulty <= 5; difficulty++) {
                        for (var spec = 0; spec <= 3; spec++) {
                            if (sortedLogs[difficulty][spec].length > 0)
                                scope.warcraftLogs[difficulty][spec] = {median:Math.floor(average(sortedLogs[difficulty][spec]) * 100),number:sortedLogs[difficulty][spec].length};
                        }
                    }
                }

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