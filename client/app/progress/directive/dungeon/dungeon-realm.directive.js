angular
    .module('app.progress')
    .directive('wlfgDungeonRealm', wlfgDungeonRealm);

wlfgDungeonRealm.$inject = ['__env'];
function wlfgDungeonRealm() {
    var directive = {
        link: link,
        restrict: 'AE',
        templateUrl: 'app/progress/directive/dungeon/dungeon-realm.directive.html',
        scope: true,
    };
    return directive;

    function link(scope, element, attrs) {
        var realms = [];



        scope.$watch(attrs.wlfgDungeonRealm, function(roster) {
            scope.dungeonRegion = attrs.region.toUpperCase();
            scope.dungeonRealm = attrs.region.toUpperCase();
            scope.dungeonRoster = roster;
            angular.forEach(roster, function(value, key) {
                if (realms[value.realm]) {
                    realms[value.realm]++;
                    if (realms[value.realm] >= 4) {
                        scope.dungeonRealm = attrs.region.toUpperCase()+'-'+value.realm;
                    }
                } else {
                    realms[value.realm] = 1;
                }


            });
        }, true);
    }

}