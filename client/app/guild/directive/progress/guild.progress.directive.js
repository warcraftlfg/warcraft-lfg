angular
    .module('app.guild')
    .directive('wlfgProgressGuild', wlfgProgressGuild);

wlfgProgressGuild.$inject = ['__env', 'progress'];
function wlfgProgressGuild(__env, progress) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild/directive/progress/guild.progress.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgProgressGuild, function(progress){
            if (progress) {
                scope.progress = progress;
                scope.progress.tooltip = [];
                scope.progress.tooltipLoad = false;
                scope.progress.name = __env.tiers[__env.tiers.current].name;
            } else {
            }
        });

        scope.loadTooltip = function() {
            if (!scope.progress.tooltipLoad) {
                progress.get({tier: __env.tiers.current,  region: attrs.region, realm: attrs.realm, name: attrs.name}, function (progress) {
                    scope.progress.tooltipLoad = true;
                    if (progress) {
                        angular.forEach(__env.tiers[__env.tiers.current].bosses, function(value, key) {
                            if (progress.mythic && progress.mythic[value] && progress.mythic[value].timestamps && progress.mythic[value].timestamps.length > 0) {
                                scope.progress.tooltip.push({difficulty: 'legendary', 'boss': 'M: '+value});
                            } else if (progress.heroic && progress.heroic[value] && progress.heroic[value].timestamps && progress.heroic[value].timestamps.length > 0) {
                                scope.progress.tooltip.push({difficulty: 'epic', 'boss': 'H: '+value});
                            } else if (progress.normal && progress.normal[value] && progress.normal[value].timestamps && progress.normal[value].timestamps.length > 0) {
                                scope.progress.tooltip.push({difficulty: 'rare', 'boss': 'N: '+value});
                            } else {
                                 scope.progress.tooltip.push({difficulty: 'common', 'boss': 'N: '+value});
                            }
                        });
                    } else {
                        angular.forEach(__env.tiers[__env.tiers.current].bosses, function(value, key) {
                            scope.progress.tooltip.push({difficulty: 'common', 'boss': 'N: '+value});
                        });
                    }
                });
            }   
        };
    }
}