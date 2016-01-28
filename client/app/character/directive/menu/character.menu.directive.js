angular
    .module('app.character')
    .directive('wlfgCharacterMenu', wlfgCharacterMenu);

function wlfgCharacterMenu() {
    var directive = {
        link: link,
        restrict: 'A',
        templateUrl: 'app/character/directive/menu/character.menu.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
    }
}