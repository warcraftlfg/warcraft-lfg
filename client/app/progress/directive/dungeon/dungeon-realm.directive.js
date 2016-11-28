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



        scope.$watch(attrs.wlfgDungeonRealm, function(team) {
            scope.team = team;
        }, true);
    }

}