angular
    .module('app.guild')
    .directive('wlfgProgressGuild', wlfgProgressGuild);

wlfgProgressGuild.$inject = ['__env', 'progress'];
function wlfgProgressGuild(__env, progress) {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/guild/directive/progress/guild.progress.directive.html',
        scope: true,
    };
    return directive;

    function link(scope, element, attrs) {
        var raidKey = attrs.key;
        var raidName = __env.tiers[__env.tiers.current[raidKey]].name;
        var raidTier = __env.tiers[__env.tiers.current[raidKey]].tier;

        scope.$watch(attrs.wlfgProgressGuild, function(progress){
            if (progress && attrs.region && attrs.realm && attrs.name) {
                if (progress[raidTier] && progress[raidTier][raidName]) {
                    progress = progress[raidTier][raidName];
                } else {
                    progress = null;
                }
            }
            if (progress) {
                scope.progressTooltip = [];
                scope.progressName = __env.tiers[__env.tiers.current[raidKey]].name;
                scope.progressTotal = __env.tiers[__env.tiers.current[raidKey]].bosses.length;
                /*if (progress[raidKey]) {
                    scope.progress = progress[raidKey];
                } else if (progress[raidTier][raidName]) {
                    scope.progress = progress[raidTier][raidName];
                }*/
                scope.progress = progress;
                if (attrs.region && attrs.realm && attrs.name) {
                    scope.progressTooltipLoad = false;
                    angular.forEach(__env.tiers[__env.tiers.current[raidKey]].bosses, function(value, key) {
                        scope.progressTooltip.push({difficulty: 'common', 'boss': 'N: '+value});
                    });
                } else {
                    scope.progressTooltipLoad = true;
                    buildTooltip();
                }
            } else {
                scope.progress = {};
                scope.progressTooltip = [];
                scope.progressName = __env.tiers[__env.tiers.current[raidKey]].name;
                scope.progressTotal = __env.tiers[__env.tiers.current[raidKey]].bosses.length;
                angular.forEach(__env.tiers[__env.tiers.current[raidKey]].bosses, function(value, key) {
                    scope.progressTooltip.push({difficulty: 'common', 'boss': 'N: '+value});
                });
            }
        });

        scope.loadTooltip = function() {
            if (!scope.progressTooltipLoad) {
                scope.progressTooltipLoad = true;
                progress.get({tier: __env.tiers[__env.tiers.current[raidKey]].tier, raid: __env.tiers[__env.tiers.current[raidKey]].name, region: attrs.region, realm: attrs.realm, name: attrs.name}, function (progress) {
                    scope.progress = progress;
                    changeTooltip();
                });
            }
        };

        function buildTooltip() {
            var progress = scope.progress;
            if (progress) {
                angular.forEach(__env.tiers[__env.tiers.current[raidKey]].bosses, function(value, key) {
                    if (progress.mythic && progress.mythic[value] && ((progress.mythic[value].timestamps && progress.mythic[value].timestamps.length > 0) || progress.mythic[value] > 0)) {
                        scope.progressTooltip.push({difficulty: 'legendary', 'boss': 'M: '+value});
                    } else if (progress.heroic && progress.heroic[value] && ((progress.heroic[value].timestamps && progress.heroic[value].timestamps.length > 0) || progress.heroic[value] > 0)) {
                        scope.progressTooltip.push({difficulty: 'epic', 'boss': 'H: '+value});
                    } else if (progress.normal && progress.normal[value] && ((progress.normal[value].timestamps && progress.normal[value].timestamps.length > 0) || progress.normal[value] > 0)) {
                        scope.progressTooltip.push({difficulty: 'rare', 'boss': 'N: '+value});
                    } else {
                         scope.progressTooltip.push({difficulty: 'common', 'boss': 'N: '+value});
                    }
                });
            } else {
                angular.forEach(__env.tiers[__env.tiers.current[raidKey]].bosses, function(value, key) {
                    scope.progressTooltip.push({difficulty: 'common', 'boss': 'N: '+value});
                });
            }
        }

        function changeTooltip() {
            var progress = scope.progress;
            if (progress) {
                angular.forEach(__env.tiers[__env.tiers.current[raidKey]].bosses, function(value, key) {
                    if (progress.mythic && progress.mythic[value] && progress.mythic[value].timestamps && progress.mythic[value].timestamps.length > 0) {
                        scope.progressTooltip[key].difficulty = "legendary";
                    } else if (progress.heroic && progress.heroic[value] && progress.heroic[value].timestamps && progress.heroic[value].timestamps.length > 0) {
                        scope.progressTooltip[key].difficulty = "epic";
                    } else if (progress.normal && progress.normal[value] && progress.normal[value].timestamps && progress.normal[value].timestamps.length > 0) {
                        scope.progressTooltip[key].difficulty = "rare";
                    } else {
                        scope.progressTooltip[key].difficulty = "common";
                    }
                });
            }
        }
    }
}