angular
    .module('app.character')
    .directive('wlfgItemT19', wlfgItemT19);

function wlfgItemT19() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/directive/item/character.item-t19.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgItemT19, function(items){
            var t19 = {
                1: "Obsidian Aspect",
                2: "Highlord",
                3: "Eagletalon",
                4: "Doomblade",
                5: "Purifier",
                6: "Dreadwyrm",
                7: "Shackled Elements",
                8: "Everburning Knowledge",
                9: "Azj'Aqir",
                10: "Enveloped Dissonance",
                11: "Astral Warden",
                12: "Second Sight",
            };

            var count = 0;
            if (items) {
                angular.forEach(items, function(item) {
                    if (item.name) {
                        if (item.name.indexOf(t19[attrs.characterClass]) >= 0) {
                            count++;
                        }
                    }
                });
            }

            scope.t19Count = count;
        }, true);
    }
}