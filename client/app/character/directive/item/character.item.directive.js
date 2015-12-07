angular
    .module('app.character')
    .directive('wlfgItem', wlfgItem);

function wlfgItem() {
    var directive = {
        link: link,
        restrict: 'A',
        scope:true,
        templateUrl: 'app/character/directive/item/character.item.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgItem, function(item){
            if (item) {
                scope.item = item;
                scope.bonus = item.bonusLists.join(':');
            }
        }, true);

        scope.slot = attrs.slot;
    }
}