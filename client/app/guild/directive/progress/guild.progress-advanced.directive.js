angular
    .module('app.guild')
    .directive('wlfgProgressAdvancedGuild', wlfgProgressAdvancedGuild);

wlfgProgressAdvancedGuild.$inject = ['__env', 'progress'];
function wlfgProgressAdvancedGuild(__env, progress) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild/directive/progress/guild.progress-advanced.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgProgressAdvancedGuild, function(progress){
            if (progress) {
                scope.progressAdvanced = {};
                scope.progressAdvanced.name = __env.tiers[__env.tiers.current].name;
                scope.progressOrder = [];
                angular.forEach(progress.mythic, function(value, key) {
                    if (value.timestamps[0].length > 0) {
                        scope.progressOrder.push({name: key, timestamp: value.timestamps[0][0], difficulty: 'mythic'});
                    }
                });
                angular.forEach(progress.heroic, function(value, key) {
                    if (value.timestamps[0].length > 0) {
                        scope.progressOrder.push({name: key, timestamp: value.timestamps[0][0], difficulty: 'heroic'});
                    }                });
                angular.forEach(progress.normal, function(value, key) {
                    if (value.timestamps[0].length > 0) {
                        scope.progressOrder.push({name: key, timestamp: value.timestamps[0][0], difficulty: 'normal'});
                    }
                });

                scope.progressAdvanced.right = Math.floor(scope.progressOrder.length / 2)*-1;
                if (scope.progressOrder.length % 2) {
                    scope.progressAdvanced.left = Math.floor(scope.progressOrder.length / 2);
                } else {
                    scope.progressAdvanced.left = Math.floor(scope.progressOrder.length / 2)+1;
                }

                console.log(scope.progressAdvanced);
            }
        });
    }
}