angular
    .module('app.character')
    .directive('wlfgProgress', wlfgProgress);

function wlfgProgress() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/character.progress.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgProgress, function(raids){
            if (raids) {
                progress = raids[raids.length-1];
                var currentProgress = {'mythic':{'total': 0, 'bosses': {}}, 'heroic':{'total': 0, 'bosses': {}}, 'normal': {'total': 0, 'bosses': {}}, 'lfr': {'total': 0, 'bosses': {}}};
                currentProgress.total = progress.bosses.length;
                progress.bosses.forEach(function (boss) {
                    currentProgress.mythic.bosses[boss.name] = boss.mythicKills;
                    if (boss.mythicKills > 0) { currentProgress.mythic.total += 1; }
                    currentProgress.heroic.bosses[boss.name] = boss.heroicKills;
                    if (boss.heroicKills > 0) { currentProgress.heroic.total += 1; }
                    currentProgress.normal.bosses[boss.name] = boss.normalKills;
                    if (boss.normalKills > 0) { currentProgress.normal.total += 1; }
                    currentProgress.lfr.bosses[boss.name] = boss.lfrKills;
                    if (boss.lfrKills > 0) { currentProgress.lfr.total += 1; }
                });     

                if (currentProgress.mythic.total > 0) {
                    currentProgress.difficulty = 'M';
                    currentProgress.progress = currentProgress.mythic.total;
                } else if (currentProgress.heroic.total > 0) {
                    currentProgress.difficulty = 'H';
                    currentProgress.progress = currentProgress.heroic.total;
                }  else if (currentProgress.normal.total > 0) {
                    currentProgress.difficulty = 'N';
                    currentProgress.progress = currentProgress.normal.total;
                } else if (currentProgress.lfr.total > 0) {
                    currentProgress.difficulty = 'L';
                    currentProgress.progress = currentProgress.lfr.total;
                }

                scope.progress = currentProgress;
            }
        });
    }
}