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
            scope.dungeonRealms = attrs.realms;
            scope.dungeonLink = null;
            scope.dungeonRoster = roster;
            if (attrs.realm && attrs.realm !== "") {
                scope.dungeonRealm = attrs.region.toUpperCase()+'-'+attrs.realm;
                scope.dungeonLink = attrs.realm;
            }
        }, true);
    }

}