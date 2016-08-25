angular
    .module('app.progress')
    .directive('wlfgProgressBoss', wlfgProgressBoss);

wlfgProgressBoss.$inject = ['__env'];
function wlfgProgressBoss(__env) {
    var directive = {
        link: link,
        restrict: 'AE',
        templateUrl: 'app/progress/directive/boss/progress.boss.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.progress = angular.fromJson(attrs.progress);
        scope.progress.tooltip = [];
        scope.progress.name = __env.tiers[__env.tiers.current].name;
        angular.forEach(__env.tiers[__env.tiers.current].bosses, function(value, key) {
            if (scope.progress.mythic[value] && scope.progress.mythic[value] > 0) {
                scope.progress.tooltip.push({difficulty: 'legendary', 'boss': 'M: '+value});
            } else if (scope.progress.heroic[value] && scope.progress.heroic[value] > 0) {
                scope.progress.tooltip.push({difficulty: 'epic', 'boss': 'H: '+value});
            } else if (scope.progress.normal[value] && scope.progress.normal[value] > 0) {
                scope.progress.tooltip.push({difficulty: 'rare', 'boss': 'N: '+value});
            } else {
                 scope.progress.tooltip.push({difficulty: 'common', 'boss': 'N: '+value});
            }
        });
    }

}