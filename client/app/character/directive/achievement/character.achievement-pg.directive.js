angular
    .module('app.character')
    .directive('wlfgAchievementPg', wlfgAchievementPg);

function wlfgAchievementPg() {
    var directive = {
        link: link,
        restrict: 'A',
        scope:true,
        templateUrl: 'app/character/directive/achievement/character.achievement-pg.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {


        scope.$watch(attrs.wlfgAchievementPg, function(provingGrounds){
            if (provingGrounds && provingGrounds[attrs.pgType]) {
                scope.pg = provingGrounds[attrs.pgType];
            } else {
                scope.pg = null;
            }
        }, true);
    }
}