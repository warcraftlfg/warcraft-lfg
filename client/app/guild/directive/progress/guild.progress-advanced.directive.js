angular
    .module('app.guild')
    .directive('wlfgProgressAdvancedGuild', wlfgProgressAdvancedGuild);

wlfgProgressAdvancedGuild.$inject = ['__env', 'progress'];
function wlfgProgressAdvancedGuild(__env, progress) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild/directive/progress/guild.progress-advanced.directive.html',
        scope: true,
    };
    return directive;

    function link(scope, element, attrs) {
        var raidKey = attrs.key;

        scope.$watch(attrs.wlfgProgressAdvancedGuild, function(progress){
            if (progress) {
                scope.progressAdvanced = {};
                scope.progressAdvanced.name =__env.tiers[__env.tiers.current[raidKey]].name;
                scope.progressOrder = [];
                scope.progress = progress[raidKey];
                angular.forEach(scope.progress.mythic, function(value, key) {
                    if (value.timestamps && value.timestamps.length > 0 && value.timestamps[0].length > 0) {
                        scope.progressOrder.push({name: key, timestamp: value.timestamps[0][0], difficulty: 'mythic'});
                    }
                });
                angular.forEach(scope.progress.heroic, function(value, key) {
                    if (value.timestamps && value.timestamps.length > 0 && value.timestamps[0].length > 0) {
                        scope.progressOrder.push({name: key, timestamp: value.timestamps[0][0], difficulty: 'heroic'});
                    }                });
                angular.forEach(scope.progress.normal, function(value, key) {
                    if (value.timestamps && value.timestamps.length > 0 && value.timestamps[0].length > 0) {
                        scope.progressOrder.push({name: key, timestamp: value.timestamps[0][0], difficulty: 'normal'});
                    }
                });

                scope.progressAdvanced.right = Math.floor(scope.progressOrder.length / 2)*-1;
                if ((scope.progressOrder.length % 2) === 0) {
                    scope.progressAdvanced.left = Math.floor(scope.progressOrder.length / 2);
                } else {
                    scope.progressAdvanced.left = Math.floor(scope.progressOrder.length / 2)+1;
                }
            }
        });
    }
}