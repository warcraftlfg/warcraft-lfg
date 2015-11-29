angular
    .module('app.character')
    .directive('wlfgLegendaryRing', legendaryRing);

function legendaryRing() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: true,
        templateUrl: 'app/character/character.legendary-ring.directive.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.$watch(attrs.wlfgLegendaryRing1, function (ring) {
            setRing(ring, scope);
        });
        scope.$watch(attrs.wlfgLegendaryRing2, function (ring) {
            setRing(ring, scope);
        });

    }

    function setRing(ring,scope) {
        if (ring && ring.id >= 124634 && ring.id <= 124638) {
            scope.quality = "legendary";
            scope.itemLevel = ring.itemLevel;
        } else if (ring && ring.id >= 118305 && ring.id <= 118309) {
            scope.quality = "epic";
            scope.itemLevel = ring.itemLevel;
        } else if (ring && ring.id >= 118300 && ring.id <= 118304) {
            scope.quality = "rare";
            scope.itemLevel = ring.itemLevel;
        } else if (ring && ring.id >= 118295 && ring.id <= 118299) {
            scope.quality = "uncommon";
            scope.itemLevel = ring.itemLevel;
        } else if (ring && ring.id >= 118290 && ring.id <= 118294) {
            scope.quality = "common";
            scope.itemLevel = ring.itemLevel;
        }
    }

}