angular
    .module('app.character')
    .directive('wlfgProgressCharacter', wlfgProgressCharacter);

wlfgProgressCharacter.$inject = ['__env'];
function wlfgProgressCharacter(__env) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/directive/progress/character.progress.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgProgressCharacter, function(raids) {
            if (raids) {
                progress = raids[raids.length-1];
                var currentProgress = {'name': progress.name, 'tooltip': [], 'mythic':{'total': 0, 'bosses': {}}, 'heroic':{'total': 0, 'bosses': {}}, 'normal': {'total': 0, 'bosses': {}}, 'lfr': {'total': 0, 'bosses': {}}};
                currentProgress.total = progress.bosses.length;
                progress.bosses.forEach(function (boss) {
                    currentProgress.mythic.bosses[boss.name] = boss.mythicKills;
                    currentProgress.heroic.bosses[boss.name] = boss.heroicKills;
                    currentProgress.normal.bosses[boss.name] = boss.normalKills;
                    currentProgress.lfr.bosses[boss.name] = boss.lfrKills;
                    if (boss.mythicKills > 0) { currentProgress.mythic.total += 1; currentProgress.tooltip.push({difficulty: 'legendary', 'boss': 'M: '+boss.name}); }
                    else if (boss.heroicKills > 0) { currentProgress.heroic.total += 1; currentProgress.tooltip.push({difficulty: 'epic', 'boss': 'H: '+boss.name}); }
                    else if (boss.normalKills > 0) { currentProgress.normal.total += 1; currentProgress.tooltip.push({difficulty: 'rare', 'boss': 'N: '+boss.name}); }
                    else { currentProgress.tooltip.push({difficulty: 'common', 'boss': 'N: '+boss.name}); }
                });     

                if (currentProgress.mythic.total > 0) {
                    currentProgress.difficulty = 'M';
                    currentProgress.difficultyClass = 'raid-mythic';
                    currentProgress.progress = currentProgress.mythic.total;
                } else if (currentProgress.heroic.total > 0) {
                    currentProgress.difficulty = 'H';
                    currentProgress.difficultyClass = 'raid-heroic';
                    currentProgress.progress = currentProgress.heroic.total;
                }  else if (currentProgress.normal.total > 0) {
                    currentProgress.difficulty = 'N';
                    currentProgress.difficultyClass = 'raid-normal';
                    currentProgress.progress = currentProgress.normal.total;
                } else {
                    currentProgress.difficulty = 'L';
                    currentProgress.difficultyClass = 'raid-lfr';
                    currentProgress.progress = currentProgress.lfr.total;
                }

                scope.progress = currentProgress;
                console.log(scope.progress);
            }
        });
    }
}