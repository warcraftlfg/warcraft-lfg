angular
    .module('app.character')
    .directive('wlfgAchievementPg', wlfgAchievementPg);

function wlfgAchievementPg() {
    var directive = {
        link: link,
        restrict: 'A',
        scope:true,
        templateUrl: 'app/character/character.achievement-pg.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {


        scope.$watch(attrs.wlfgAchievementPg, function(achievements){
            var statId = {
                'tank': [9578, 9579, 9580, 26345],
                'dps': [9572, 9573, 9574, 26344],
                'healer': [9584, 9585, 9586, 26346]
            };

            var criteriaId;

            scope.best = 0;

            if (achievements && achievements.achievementsCompleted) {
                if (achievements.achievementsCompleted.indexOf(statId[attrs.pgType][2]) != -1) {
                    scope.gold = true;
                    if ((criteriaId = achievements.criteria.indexOf(statId[attrs.pgType][3])) != -1) {
                        scope.best = achievements.criteria[criteriaId];
                    }
                } else if (achievements.achievementsCompleted.indexOf(statId[attrs.pgType][1]) != -1) {
                    scope.silver = true;
                } else if (achievements.achievementsCompleted.indexOf(statId[attrs.pgType][0]) != -1) {
                    scope.copper = true;
                }
            }
        }, true);
    }
}