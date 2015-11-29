angular
    .module('app.character')
    .directive('wlfgItemT18', wlfgItemT18);

function wlfgItemT18() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/character.item-t18.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgItemT18, function(items){
            var t18 = {
                1: "Iron Wrath",
                2: "Ceaseless Vigil",
                3: "Savage Hunt",
                4: "Felblade",
                5: "Pious",
                6: "Demongaze",
                7: "Living Mountain",
                8: "Arcanic Conclave",
                9: "Deathrattle",
                10: "Hurricane's Eye",
                11: "Oathclaw",
            };
            var count = 0;
            if (items) {
                angular.forEach(items, function(item) {
                    if (item.name) {
                        if (item.name.indexOf(t18[attrs.characterClass]) >= 0) {
                            count++;
                        }
                    }
                });
            }

            scope.t18Count = count;
        }, true);
    }
}