angular
    .module('app.character')
    .directive('wlfgChallengeMedal', wlfgChallengeMedal);

function wlfgChallengeMedal() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/character.challenge-medal.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgChallengeMedal, function(achievements){

            var statId = {
                'gold': [8878, 8882, 9004, 8886, 9000, 8874, 8890, 8894],
                'silver': [8877, 8881, 9003, 8885, 8999, 8873, 8889, 8893],
                'copper': [8876, 8880, 90002, 8884, 8998, 8872, 8888, 8892]
            }

            scope.medalCount = 0;
            scope.medalType = attrs.medalType;

            if (achievements && achievements.achievementsCompleted) {
                statId[attrs.medalType].forEach(function(id) {
                    if (achievements.achievementsCompleted.indexOf(id) != -1) {
                        scope.medalCount++;
                    }
                });
            }

        }, true);
    }
}