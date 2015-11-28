angular
    .module('app.character')
    .directive('wlfgItem', wlfgItem);

function wlfgItem() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/character.item.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgItem, function(item){
            if (item) {
                scope.item = item;
            }
        }, true);
    }
}